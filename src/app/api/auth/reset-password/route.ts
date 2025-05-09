"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {
	getPasswordResetEmailTemplate,
	getPasswordResetEmailText,
} from "@/split/server/templates/emails/reset-password-email";

// Function to send email with reset link
async function sendResetEmail(email: string, token: string) {
	// Create a test account if no SMTP configuration is available
	// In production, you would use your own SMTP settings
	const testAccount = await nodemailer.createTestAccount();

	// Create a transporter object
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.ethereal.email",
		port: parseInt(process.env.SMTP_PORT || "587"),
		secure: process.env.SMTP_SECURE == "true",
		auth: {
			user: process.env.SMTP_USER || testAccount.user,
			pass: process.env.SMTP_PASS || testAccount.pass,
		},
	});

	// Reset link URL
	const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/user/reset-password/${token}`;

	// Email content
	const mailOptions = {
		from: process.env.SMTP_FROM || "Ireland FAQ <noreply@irelandfaq.com>",
		to: email,
		subject: "Password Reset Request",
		text: getPasswordResetEmailText(resetUrl),
		html: getPasswordResetEmailTemplate(resetUrl),
	};

	// Send the email
	const info = await transporter.sendMail(mailOptions);

	// Log the test URL for development purposes
	if (!process.env.SMTP_HOST) {
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	}

	return info;
}

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { email: email as string },
		});

		if (!user) {
			// For security reasons, don't reveal that the user doesn't exist
			// Instead, return a success response to prevent email enumeration attacks
			return NextResponse.json({ success: true }, { status: 200 });
		}

		// Generate a random token
		const token = crypto.randomBytes(32).toString("hex");

		// Set token expiry (1 hour from now)
		const tokenExpiry = new Date();
		tokenExpiry.setHours(tokenExpiry.getHours() + 1);

		// Save the token and expiry in the database
		await prisma.user.update({
			where: { id: user.id },
			data: {
				resetToken: token,
				resetTokenExpiry: tokenExpiry,
			},
		});

		// Send the reset email
		await sendResetEmail(email, token);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Password reset error:", error);
		return NextResponse.json(
			{
				error: "Failed to process password reset request",
				detail: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}

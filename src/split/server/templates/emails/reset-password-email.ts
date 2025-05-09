/**
 * Password reset email template
 */

/**
 * Generates the HTML content for the password reset email
 * @param resetUrl The URL for resetting the password
 * @returns HTML content as a string
 */
export function getPasswordResetEmailTemplate(resetUrl: string): string {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333333;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <tr>
          <td style="padding: 30px 0; text-align: center; background-color: #0070f3; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Auto License Test</h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #0070f3; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Password Reset Request</h2>

            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 16px;">Hello,</p>

            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 16px;">We received a request to reset the password for your Auto License Test account. If you didn't make this request, you can safely ignore this email.</p>

            <p style="margin-bottom: 25px; line-height: 1.6; font-size: 16px;">To reset your password, click the button below:</p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #0070f3; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">Reset Your Password</a>
            </div>

            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 16px;">If the button doesn't work, you can copy and paste the following link into your browser:</p>

            <p style="margin-bottom: 25px; line-height: 1.6; font-size: 14px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; border-left: 4px solid #0070f3;">
              <a href="${resetUrl}" style="color: #0070f3; text-decoration: none;">${resetUrl}</a>
            </p>

            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 16px;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>

            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 16px;">If you have any questions or need assistance, please contact our support team.</p>

            <p style="margin-bottom: 5px; line-height: 1.6; font-size: 16px;">Best regards,</p>
            <p style="margin-bottom: 0; line-height: 1.6; font-size: 16px;"><strong>The Auto License Test Team</strong></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 30px; text-align: center; background-color: #f5f5f5; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #eeeeee;">
            <p style="margin-bottom: 0; font-size: 12px; color: #999999;">This is an automated email, please do not reply.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates the plain text content for the password reset email
 * @param resetUrl The URL for resetting the password
 * @returns Plain text content as a string
 */
export function getPasswordResetEmailText(resetUrl: string): string {
	return `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`;
}

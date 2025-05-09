import React from "react";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { LicenseAnswerType } from "@/types";

interface LicenseTestCardProps {
	id: string;
	question: string;
	image?: string;
	answers: LicenseAnswerType[];
	onAnswerSelected: (answerId: string, isCorrect: boolean) => void;
	selectedAnswerId?: string;
	showResult?: boolean;
}

export function LicenseTestCard({
	id,
	question,
	image,
	answers,
	onAnswerSelected,
	selectedAnswerId,
	showResult = false,
}: LicenseTestCardProps) {
	return (
		<Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-md">
			{image && (
				<div className="relative w-full h-40 border-b">
					<Image
						src={image}
						alt="Question image"
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 768px"
					/>
				</div>
			)}
			<CardHeader className="py-3 px-4">
				<CardTitle className="text-lg">{question}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 px-4 py-2">
				{answers.map((answer) => {
					const isSelected = selectedAnswerId === answer.id;
					let buttonVariant:
						| "default"
						| "outline"
						| "secondary"
						| "ghost" = "outline";

					if (showResult) {
						if (answer.isCorrect) {
							buttonVariant = "default"; // Correct answer
						} else if (isSelected && !answer.isCorrect) {
							buttonVariant = "secondary"; // Wrong selected answer
						}
					} else if (isSelected) {
						buttonVariant = "default"; // Selected answer
					}

					return (
						<Button
							key={answer.id}
							variant={buttonVariant}
							size="sm"
							className="w-full justify-start text-left h-auto py-2 px-3 text-sm"
							onClick={() =>
								onAnswerSelected(answer.id, answer.isCorrect)
							}
							disabled={showResult || !!selectedAnswerId}
						>
							<span className="flex-1">{answer.text}</span>
							{showResult && answer.isCorrect && (
								<CheckCircle className="h-4 w-4 text-green-500 ml-2 shrink-0" />
							)}
							{showResult && isSelected && !answer.isCorrect && (
								<XCircle className="h-4 w-4 text-red-500 ml-2 shrink-0" />
							)}
						</Button>
					);
				})}
			</CardContent>
			<CardFooter className="flex justify-between py-2 px-4 border-t bg-muted/30">
				{showResult && selectedAnswerId && (
					<div className="flex items-center text-sm">
						{answers.find((a) => a.id === selectedAnswerId)
							?.isCorrect ? (
							<div className="flex items-center text-green-600">
								<CheckCircle className="h-4 w-4 mr-2" />
								<span>Correct answer!</span>
							</div>
						) : (
							<div className="flex items-center text-red-600">
								<XCircle className="h-4 w-4 mr-2" />
								<span>
									Incorrect. Please review the correct answer.
								</span>
							</div>
						)}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}

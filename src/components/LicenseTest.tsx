"use client";

import React, { useState } from "react";
import { LicenseTestCard } from "@/components/LicenseTestCard";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LicenseQuestion,
	licenseTestQuestions,
	calculatePassThreshold,
	didUserPass,
	saveTestResult,
} from "@/services/licenseTestService";
import { CheckCircle, XCircle, Trophy, RefreshCw } from "lucide-react";

interface LicenseTestProps {
	onComplete?: (score: number, totalQuestions: number) => void;
}

export function LicenseTest({ onComplete }: LicenseTestProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
	const [correctAnswers, setCorrectAnswers] = useState<
		Record<string, boolean>
	>({});
	const [showResult, setShowResult] = useState(false);
	const [testCompleted, setTestCompleted] = useState(false);
	const [score, setScore] = useState(0);

	const currentQuestion = licenseTestQuestions[currentQuestionIndex];
	const totalQuestions = licenseTestQuestions.length;
	const progressPercentage =
		((currentQuestionIndex + 1) / totalQuestions) * 100;

	const handleAnswerSelected = (answerId: string, isCorrect: boolean) => {
		setUserAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: answerId,
		}));

		setCorrectAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: isCorrect,
		}));

		setShowResult(true);
	};

	const handleNextQuestion = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setShowResult(false);
		} else {
			// Calculate final score
			const correctCount =
				Object.values(correctAnswers).filter(Boolean).length;
			setScore(correctCount);
			setTestCompleted(true);

			// Save the test result
			saveTestResult(correctCount, totalQuestions).then(() => {
				if (onComplete) {
					onComplete(correctCount, totalQuestions);
				}
			});
		}
	};

	const handleRestartTest = () => {
		setCurrentQuestionIndex(0);
		setUserAnswers({});
		setCorrectAnswers({});
		setShowResult(false);
		setTestCompleted(false);
		setScore(0);
	};

	if (testCompleted) {
		const passThreshold = calculatePassThreshold(totalQuestions);
		const passed = didUserPass(score, totalQuestions);
		const scorePercentage = Math.round((score / totalQuestions) * 100);

		return (
			<Card className="w-full max-w-2xl mx-auto shadow-md">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl">Test Results</CardTitle>
						{passed ? (
							<Trophy className="h-6 w-6 text-yellow-500" />
						) : (
							<XCircle className="h-6 w-6 text-red-500" />
						)}
					</div>
					<CardDescription>
						You scored {score} out of {totalQuestions} questions
						correctly ({scorePercentage}%).
					</CardDescription>
				</CardHeader>

				<CardContent className="py-3">
					<div className="flex items-center gap-2 mb-3">
						<div className="w-full bg-muted rounded-full h-2.5">
							<div
								className={`h-2.5 rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
								style={{ width: `${scorePercentage}%` }}
							></div>
						</div>
						<span className="text-sm font-medium">
							{scorePercentage}%
						</span>
					</div>

					<div
						className={`text-base font-medium mb-2 ${passed ? "text-green-600" : "text-red-600"} flex items-center gap-2`}
					>
						{passed ? (
							<>
								<CheckCircle className="h-5 w-5" />
								<span>
									Congratulations! You passed the test.
								</span>
							</>
						) : (
							<>
								<XCircle className="h-5 w-5" />
								<span>Sorry, you did not pass the test.</span>
							</>
						)}
					</div>

					<div className="text-sm text-muted-foreground">
						{passed ? (
							<p>
								You have demonstrated a good understanding of
								the driving rules. Keep practicing to maintain
								your knowledge.
							</p>
						) : (
							<p>
								You need to score at least {passThreshold}{" "}
								correct answers (
								{Math.round(
									(passThreshold / totalQuestions) * 100,
								)}
								%) to pass. Please review the material and try
								again.
							</p>
						)}
					</div>
				</CardContent>

				<CardFooter className="pt-2 border-t">
					<Button
						onClick={handleRestartTest}
						className="w-full"
						size="sm"
					>
						<RefreshCw className="h-4 w-4 mr-2" />
						Restart Test
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-1 mb-2">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-medium">Driver License Test</h2>
					<div className="text-sm font-medium">
						{currentQuestionIndex + 1} / {totalQuestions}
					</div>
				</div>

				<div className="w-full bg-muted rounded-full h-1.5 mb-1">
					<div
						className="h-1.5 rounded-full bg-primary transition-all duration-300"
						style={{ width: `${progressPercentage}%` }}
					></div>
				</div>
			</div>

			<LicenseTestCard
				id={currentQuestion.id}
				question={currentQuestion.question}
				image={currentQuestion.image}
				answers={currentQuestion.answers}
				onAnswerSelected={handleAnswerSelected}
				selectedAnswerId={userAnswers[currentQuestion.id]}
				showResult={showResult}
			/>

			{showResult && (
				<div className="flex justify-end mt-2">
					<Button
						onClick={handleNextQuestion}
						size="sm"
						className="px-4"
					>
						{currentQuestionIndex < totalQuestions - 1
							? "Next Question"
							: "See Results"}
					</Button>
				</div>
			)}
		</div>
	);
}

import { toast } from "sonner";

// Define the question interface
export interface LicenseQuestion {
	id: string;
	question: string;
	image?: string;
	answers: {
		id: string;
		text: string;
		isCorrect: boolean;
	}[];
}

// Sample license test questions
export const licenseTestQuestions: LicenseQuestion[] = [
	{
		id: "q1",
		question: "What does a red traffic light mean?",
		image: "https://ireland-faq-storage.b-cdn.net/traffic-light-red.jpg",
		answers: [
			{ id: "a1", text: "Slow down", isCorrect: false },
			{ id: "a2", text: "Stop completely", isCorrect: true },
			{ id: "a3", text: "Proceed with caution", isCorrect: false },
			{
				id: "a4",
				text: "Speed up to clear the intersection",
				isCorrect: false,
			},
		],
	},
	{
		id: "q2",
		question: "What is the national speed limit on motorways in Ireland?",
		answers: [
			{ id: "a1", text: "100 km/h", isCorrect: false },
			{ id: "a2", text: "110 km/h", isCorrect: false },
			{ id: "a3", text: "120 km/h", isCorrect: true },
			{ id: "a4", text: "130 km/h", isCorrect: false },
		],
	},
	{
		id: "q3",
		question: "When approaching a yield sign, what should you do?",
		image: "https://ireland-faq-storage.b-cdn.net/yield-sign.jpg",
		answers: [
			{
				id: "a1",
				text: "Always come to a complete stop",
				isCorrect: false,
			},
			{
				id: "a2",
				text: "Slow down and be prepared to stop if necessary",
				isCorrect: true,
			},
			{
				id: "a3",
				text: "Maintain your speed but look for other vehicles",
				isCorrect: false,
			},
			{
				id: "a4",
				text: "Speed up to merge with traffic",
				isCorrect: false,
			},
		],
	},
	{
		id: "q4",
		question:
			"What is the minimum age to obtain a learner permit for a car (category B) in Ireland?",
		answers: [
			{ id: "a1", text: "16 years", isCorrect: false },
			{ id: "a2", text: "17 years", isCorrect: true },
			{ id: "a3", text: "18 years", isCorrect: false },
			{ id: "a4", text: "21 years", isCorrect: false },
		],
	},
	{
		id: "q5",
		question: "What does this road sign indicate?",
		image: "https://ireland-faq-storage.b-cdn.net/roundabout-sign.jpg",
		answers: [
			{ id: "a1", text: "No entry", isCorrect: false },
			{ id: "a2", text: "One-way street", isCorrect: false },
			{ id: "a3", text: "Roundabout ahead", isCorrect: true },
			{ id: "a4", text: "Circular route", isCorrect: false },
		],
	},
];

/**
 * Calculates the pass threshold for the license test
 * @param totalQuestions - The total number of questions in the test
 * @returns The minimum number of correct answers needed to pass
 */
export function calculatePassThreshold(totalQuestions: number): number {
	return Math.ceil(totalQuestions * 0.8); // 80% to pass
}

/**
 * Determines if the user passed the test based on their score
 * @param score - The user's score (number of correct answers)
 * @param totalQuestions - The total number of questions in the test
 * @returns Whether the user passed the test
 */
export function didUserPass(score: number, totalQuestions: number): boolean {
	return score >= calculatePassThreshold(totalQuestions);
}

/**
 * Saves the test result to the user's history (mock implementation)
 * @param score - The user's score
 * @param totalQuestions - The total number of questions
 * @returns Promise that resolves when the result is saved
 */
export async function saveTestResult(
	score: number,
	totalQuestions: number,
): Promise<boolean> {
	try {
		// This is a mock implementation
		// In a real application, this would save the result to a database
		console.log(`Test result saved: ${score}/${totalQuestions}`);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		toast.success("Test result saved successfully");
		return true;
	} catch (error) {
		console.error("Error saving test result:", error);
		toast.error("Failed to save test result");
		return false;
	}
}

/**
 * Gets a random subset of questions for a practice test
 * @param count - The number of questions to include in the practice test
 * @returns Array of randomly selected questions
 */
export function getRandomQuestions(count: number = 5): LicenseQuestion[] {
	if (count >= licenseTestQuestions.length) {
		return [...licenseTestQuestions];
	}

	// Create a copy of the questions array
	const questions = [...licenseTestQuestions];

	// Shuffle the array using Fisher-Yates algorithm
	for (let i = questions.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[questions[i], questions[j]] = [questions[j], questions[i]];
	}

	// Return the first 'count' questions
	return questions.slice(0, count);
}

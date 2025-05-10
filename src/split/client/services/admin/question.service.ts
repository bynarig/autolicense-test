import axiosInstance from "@client/lib/axios";
import { QuestionType } from "@/types";

export async function getQuestions() {
	const res = await axiosInstance.get("/admin/tests/questions");
	return {
		questions: res.data.data,
		totalCount: res.data.totalCount || res.data.length,
	};
}

export async function getQuestion(id: string) {
	const res = await axiosInstance.get(`/admin/tests/questions/${id}`);
	return res.data;
}

export async function createQuestion(data: Partial<QuestionType>) {
	const res = await axiosInstance.post("/admin/tests/questions", data);

	return res;
}

export async function updateQuestion(data: Partial<QuestionType>, id: string) {
	const res = await axiosInstance.put(`/admin/tests/questions/${id}`, data);

	return res.data;
}

export async function deleteQuestion(id: string) {
	const res = await axiosInstance.delete(`/admin/tests/questions/${id}`);
	return res.data;
}

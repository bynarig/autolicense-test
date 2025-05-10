import axiosInstance from "@client/lib/axios";
import { TestType } from "@/types";

export async function getTests() {
	const res = await axiosInstance.get("/admin/tests/");
	return {
		tests: res.data.data,
		totalCount: res.data.totalCount || res.data.length,
	};
}

export async function getTest(id: string) {
	const res = await axiosInstance.get(`/admin/tests/${id}`);
	return res.data;
}

export async function createTest(data: Partial<TestType>) {
	const res = await axiosInstance.post("/admin/tests/", data);

	return res;
}

export async function updateTest(data: Partial<TestType>, id: string) {
	const res = await axiosInstance.put(`/admin/tests/${id}`, data);

	return res.data;
}

export async function deleteTest(id: string) {
	const res = await axiosInstance.delete(`/admin/tests/${id}`);
	return res.data;
}

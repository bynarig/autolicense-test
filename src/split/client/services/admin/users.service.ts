import axiosInstance from "@client/lib/axios";
import { UserType } from "@/types";

export async function getUsers() {
	const res = await axiosInstance.get("/admin/users");
	return {
		users: res.data.data,
		totalCount: res.data.totalCount || res.data.length,
	};
}

export async function getUser(id: string) {
	const res = await axiosInstance.get(`/admin/users/${id}`);
	return res.data;
}

export async function createUser(data: Partial<UserType>) {
	const res = await axiosInstance.post("/admin/users", data);

	return res;
}

export async function updateUser(data: Partial<UserType>, id: string) {
	const res = await axiosInstance.put(`/admin/users/${id}`, data);

	return res.data;
}

export async function deleteUser(id: string) {
	const res = await axiosInstance.delete(`/admin/users/${id}`);
	return res.data;
}

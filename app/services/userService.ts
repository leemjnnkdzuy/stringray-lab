import api from "@/app/utils/axios";

export interface Plot {
	id: string;
	name: string;
	description?: string;
	type: "javascript" | "matlab" | "math";
	isPublic: boolean;
	isPinned: boolean;
	updatedAt: string;
}

export interface UserInfo {
	id: string;
	username: string;
	avatar?: string;
	cover?: string;
	bio?: string;
	location?: string;
	workplace?: string;
	birthday?: string;
	socialLinks?: {
		facebook?: string;
		twitter?: string;
		github?: string;
		linkedin?: string;
		instagram?: string;
		website?: string;
	};
	visibilitySettings?: {
		bio?: boolean;
		birthday?: boolean;
		location?: boolean;
		workplace?: boolean;
		socialLinks?: {
			facebook?: boolean;
			twitter?: boolean;
			github?: boolean;
			linkedin?: boolean;
			instagram?: boolean;
			website?: boolean;
		};
	};
	createdAt?: string;
}

export interface GetUserPlotsResponse {
	plots: Plot[];
	user: UserInfo;
	isOwnProfile: boolean;
}

export interface TogglePinResponse {
	message: string;
	plot?: Plot;
}

export const userService = {
	async getUserPlots(
		userId: string,
		pinned?: boolean
	): Promise<GetUserPlotsResponse> {
		try {
			const url = pinned
				? `/users/${userId}/plots?pinned=true`
				: `/users/${userId}/plots`;
			const res = await api.get(url);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			throw (
				axiosError.response?.data || {
					message: "Lấy danh sách bản vẽ thất bại",
				}
			);
		}
	},

	async togglePlotPin(
		plotType: string,
		plotId: string,
		isPinned: boolean
	): Promise<TogglePinResponse> {
		try {
			const res = await api.patch(`/plots/${plotType}/${plotId}`, {
				isPinned,
			});
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			throw (
				axiosError.response?.data || {message: "Cập nhật ghim thất bại"}
			);
		}
	},
};

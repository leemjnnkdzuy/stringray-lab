import api from "@/app/utils/axios";

export interface SocialLinksVisibility {
	facebook: boolean;
	twitter: boolean;
	github: boolean;
	linkedin: boolean;
	instagram: boolean;
	website: boolean;
}

export interface VisibilitySettings {
	bio: boolean;
	birthday: boolean;
	location: boolean;
	workplace: boolean;
	socialLinks: SocialLinksVisibility;
}

export interface SocialLinks {
	facebook?: string;
	twitter?: string;
	github?: string;
	linkedin?: string;
	instagram?: string;
	website?: string;
}

export interface UpdateProfileData {
	avatar?: string;
	birthday?: string | null;
	location?: string | null;
	workplace?: string | null;
	bio?: string | null;
	socialLinks?: SocialLinks | null;
	visibilitySettings?: VisibilitySettings;
}

export interface UpdateProfileResponse {
	message: string;
	user?: {
		id: string;
		username: string;
		email: string;
		avatar?: string;
		birthday?: string;
		location?: string;
		workplace?: string;
		bio?: string;
		socialLinks?: SocialLinks;
		visibilitySettings?: VisibilitySettings;
	};
}

export const profileService = {
	async updateProfile(
		data: UpdateProfileData
	): Promise<UpdateProfileResponse> {
		try {
			const res = await api.patch("/auth/profile", data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: UpdateProfileResponse};
			};
			throw (
				axiosError.response?.data || {
					message: "Đã xảy ra lỗi khi cập nhật profile",
				}
			);
		}
	},
};

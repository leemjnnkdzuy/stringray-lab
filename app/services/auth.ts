import api from "@/app/utils/axios";

export const authService = {
	async register(data: {email: string; username: string; password: string}) {
		try {
			const res = await api.post("/auth/register", data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return axiosError.response?.data || {message: "Đăng ký thất bại"};
		}
	},

	async login(data: {email: string; password: string; rememberMe?: boolean}) {
		try {
			const res = await api.post("/auth/login", data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return axiosError.response?.data || {message: "Đăng nhập thất bại"};
		}
	},

	async logout() {
		try {
			const res = await api.post("/auth/logout");
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return axiosError.response?.data || {message: "Đăng xuất thất bại"};
		}
	},

	async getMe() {
		try {
			const res = await api.get("/auth/me");
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return (
				axiosError.response?.data || {message: "Lấy thông tin thất bại"}
			);
		}
	},

	async refresh() {
		try {
			const res = await api.post("/auth/refresh");
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return (
				axiosError.response?.data || {message: "Làm mới token thất bại"}
			);
		}
	},

	async forgotPassword(email: string) {
		try {
			const res = await api.post("/auth/forgot-password", {email});
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return (
				axiosError.response?.data || {message: "Gửi yêu cầu thất bại"}
			);
		}
	},

	async verifyOtp(email: string, otp: string) {
		try {
			const res = await api.post("/auth/verify-otp", {email, otp});
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return axiosError.response?.data || {message: "Xác thực thất bại"};
		}
	},

	async validateOtp(email: string, otp: string) {
		try {
			const res = await api.post("/auth/verify-otp", {
				email,
				otp,
				type: "check",
			});
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return axiosError.response?.data || {message: "Xác thực thất bại"};
		}
	},

	async resetPassword(data: {
		email: string;
		otp: string;
		newPassword: string;
	}) {
		try {
			const res = await api.post("/auth/reset-password", data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message?: string}};
			};
			return (
				axiosError.response?.data || {
					message: "Đặt lại mật khẩu thất bại",
				}
			);
		}
	},
};

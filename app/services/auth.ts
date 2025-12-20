export const authService = {
	async register(data: any) {
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		});
		return res.json();
	},

	async login(data: any) {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		});
		return res.json();
	},

	async forgotPassword(email: string) {
		const res = await fetch("/api/auth/forgot-password", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({email}),
		});
		return res.json();
	},

	async verifyOtp(email: string, otp: string) {
		const res = await fetch("/api/auth/verify-otp", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({email, otp}),
		});
		return res.json();
	},

	async validateOtp(email: string, otp: string) {
		const res = await fetch("/api/auth/verify-otp", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({email, otp, type: "check"}),
		});
		return res.json();
	},

	async resetPassword(data: any) {
		const res = await fetch("/api/auth/reset-password", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		});
		return res.json();
	},
};

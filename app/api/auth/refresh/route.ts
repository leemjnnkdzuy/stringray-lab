import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function POST() {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!refreshToken) {
			return NextResponse.json(
				{message: "Không tìm thấy refresh token"},
				{status: 401}
			);
		}

		const refreshSecret =
			process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";
		const jwtSecret = process.env.JWT_SECRET || "fallback_secret";

		const decoded = jwt.verify(refreshToken, refreshSecret) as {
			userId: string;
		};

		const accessToken = jwt.sign({userId: decoded.userId}, jwtSecret, {
			expiresIn: "15m",
		} as jwt.SignOptions);

		const response = NextResponse.json(
			{message: "Token đã được làm mới"},
			{status: 200}
		);

		response.cookies.set("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Refresh token error:", error);
		return NextResponse.json(
			{message: "Refresh token không hợp lệ hoặc đã hết hạn"},
			{status: 401}
		);
	}
}

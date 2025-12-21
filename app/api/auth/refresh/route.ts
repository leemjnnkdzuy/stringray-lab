import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const ACCESS_COOKIE_MAX_AGE = 15 * 60;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

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

		await connectDatabase();
		const user = await User.findById(decoded.userId).select(
			"-password -otp -otpExpires"
		);

		if (!user) {
			return NextResponse.json(
				{message: "Người dùng không tồn tại"},
				{status: 404}
			);
		}

		const newAccessToken = jwt.sign(
			{userId: user._id, email: user.email, username: user.username},
			jwtSecret,
			{expiresIn: ACCESS_TOKEN_EXPIRY} as jwt.SignOptions
		);

		const newRefreshToken = jwt.sign({userId: user._id}, refreshSecret, {
			expiresIn: REFRESH_TOKEN_EXPIRY,
		} as jwt.SignOptions);

		const response = NextResponse.json(
			{
				message: "Token đã được làm mới",
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
					avatar: user.avatar,
				},
			},
			{status: 200}
		);

		response.cookies.set("accessToken", newAccessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: ACCESS_COOKIE_MAX_AGE,
			path: "/",
		});

		response.cookies.set("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: REFRESH_COOKIE_MAX_AGE,
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

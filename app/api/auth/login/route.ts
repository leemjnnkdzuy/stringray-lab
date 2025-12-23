import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DEFAULT = "7d";
const REFRESH_TOKEN_EXPIRY_REMEMBER = "30d";
const REFRESH_COOKIE_MAX_AGE_DEFAULT = 7 * 24 * 60 * 60;
const REFRESH_COOKIE_MAX_AGE_REMEMBER = 30 * 24 * 60 * 60;

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {
			email: identifier,
			password,
			rememberMe = false,
		} = await req.json();

		if (!identifier || !password) {
			return NextResponse.json(
				{message: "Vui lòng nhập email/username và mật khẩu"},
				{status: 400}
			);
		}

		const user = await User.findOne({
			$or: [{email: identifier}, {username: identifier}],
		});
		if (!user || !user.password) {
			return NextResponse.json(
				{message: "Thông tin đăng nhập không chính xác"},
				{status: 401}
			);
		}

		if (!user.isVerified) {
			return NextResponse.json(
				{message: "Tài khoản chưa được xác thực"},
				{status: 401}
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{message: "Thông tin đăng nhập không chính xác"},
				{status: 401}
			);
		}

		const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
		const refreshSecret =
			process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";

		const accessToken = jwt.sign(
			{userId: user._id, email: user.email, username: user.username},
			jwtSecret,
			{expiresIn: ACCESS_TOKEN_EXPIRY} as jwt.SignOptions
		);

		const refreshTokenExpiry = rememberMe
			? REFRESH_TOKEN_EXPIRY_REMEMBER
			: REFRESH_TOKEN_EXPIRY_DEFAULT;

		const refreshToken = jwt.sign({userId: user._id}, refreshSecret, {
			expiresIn: refreshTokenExpiry,
		} as jwt.SignOptions);

		const response = NextResponse.json(
			{
				message: "Đăng nhập thành công",
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
					avatar: user.avatar,
				},
			},
			{status: 200}
		);

		response.cookies.set("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60,
			path: "/",
		});

		response.cookies.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: rememberMe
				? REFRESH_COOKIE_MAX_AGE_REMEMBER
				: REFRESH_COOKIE_MAX_AGE_DEFAULT,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi đăng nhập"},
			{status: 500}
		);
	}
}

import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {email, password} = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{message: "Vui lòng nhập email và mật khẩu"},
				{status: 400}
			);
		}

		const user = await User.findOne({email});
		if (!user || !user.password) {
			return NextResponse.json(
				{message: "Email hoặc mật khẩu không chính xác"},
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
				{message: "Email hoặc mật khẩu không chính xác"},
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

		const refreshToken = jwt.sign({userId: user._id}, refreshSecret, {
			expiresIn: REFRESH_TOKEN_EXPIRY,
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
			maxAge: 7 * 24 * 60 * 60,
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

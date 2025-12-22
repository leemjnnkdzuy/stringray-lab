import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;

		if (!accessToken) {
			return NextResponse.json(
				{message: "Chưa đăng nhập"},
				{status: 401}
			);
		}

		const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
		const decoded = jwt.verify(accessToken, jwtSecret) as {
			userId: string;
			email: string;
			username: string;
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

		return NextResponse.json(
			{
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
					avatar: user.avatar,
					cover: user.cover,
					birthday: user.birthday,
					location: user.location,
					workplace: user.workplace,
					bio: user.bio,
					socialLinks: user.socialLinks,
					visibilitySettings: user.visibilitySettings,
					isVerified: user.isVerified,
					createdAt: user.createdAt,
				},
			},
			{status: 200}
		);
	} catch (error) {
		console.error("Get user error:", error);
		return NextResponse.json(
			{message: "Token không hợp lệ hoặc đã hết hạn"},
			{status: 401}
		);
	}
}

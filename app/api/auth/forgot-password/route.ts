import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import {sendEmail, getResetPasswordEmailTemplate} from "@/app/utils/SendMail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {email} = await req.json();

		if (!email) {
			return NextResponse.json(
				{message: "Vui lòng nhập email"},
				{status: 400}
			);
		}

		const user = await User.findOne({email});
		if (!user) {
			return NextResponse.json(
				{message: "Nếu email tồn tại, OTP đã được gửi"},
				{status: 200}
			);
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		const hashedOtp = await bcrypt.hash(otp, 10);
		const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

		user.otp = hashedOtp;
		user.otpExpires = otpExpires;
		await user.save();

		const subject = "Đặt lại mật khẩu - Stingray Lab";
		const html = getResetPasswordEmailTemplate(user.username, otp);

		await sendEmail(email, subject, html);

		return NextResponse.json(
			{message: "Mã OTP đã được gửi đến email của bạn"},
			{status: 200}
		);
	} catch (error) {
		console.error("Forgot Password error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi gửi OTP"},
			{status: 500}
		);
	}
}

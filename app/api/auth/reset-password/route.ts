import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {email, otp, newPassword} = await req.json();

		if (!email || !otp || !newPassword) {
			return NextResponse.json(
				{message: "Vui lòng nhập đầy đủ thông tin"},
				{status: 400}
			);
		}

		console.log("Resetting password for:", email);

		const user = await User.findOne({email});
		if (!user || !user.otp || !user.otpExpires) {
			return NextResponse.json(
				{message: "Mã OTP không hợp lệ hoặc đã hết hạn"},
				{status: 400}
			);
		}

		if (user.otpExpires < new Date()) {
			return NextResponse.json(
				{message: "Mã OTP đã hết hạn"},
				{status: 400}
			);
		}

		const isOtpValid = await bcrypt.compare(otp, user.otp);
		if (!isOtpValid) {
			return NextResponse.json(
				{message: "Mã OTP không chính xác"},
				{status: 400}
			);
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		user.otp = undefined;
		user.otpExpires = undefined;
		await user.save();

		return NextResponse.json(
			{message: "Đặt lại mật khẩu thành công"},
			{status: 200}
		);
	} catch (error) {
		console.error("Reset Password error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi đặt lại mật khẩu"},
			{status: 500}
		);
	}
}

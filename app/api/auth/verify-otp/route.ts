import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {email, otp, type} = await req.json();

		if (!email || !otp) {
			return NextResponse.json(
				{message: "Vui lòng nhập email và OTP"},
				{status: 400}
			);
		}

		const user = await User.findOne({email});
		if (!user) {
			return NextResponse.json(
				{message: "Người dùng không tồn tại"},
				{status: 404}
			);
		}

		if (!user.otp || !user.otpExpires) {
			return NextResponse.json(
				{message: "Không có yêu cầu xác thực OTP nào đang chờ xử lý"},
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

		if (type === "check") {
			return NextResponse.json({message: "Mã OTP hợp lệ"}, {status: 200});
		}

		user.isVerified = true;
		user.otp = undefined;
		user.otpExpires = undefined;
		await user.save();

		return NextResponse.json(
			{message: "Xác thực tài khoản thành công"},
			{status: 200}
		);
	} catch (error) {
		console.error("Verify OTP error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi xác thực OTP"},
			{status: 500}
		);
	}
}

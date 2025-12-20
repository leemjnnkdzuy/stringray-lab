import {NextResponse} from "next/server";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";
import {sendEmail, getVerificationEmailTemplate} from "@/app/utils/SendMail";
import bcrypt from "bcryptjs";
import defaultAvatarData from "@/app/assets/defualtAvatar.json";

export async function POST(req: Request) {
	try {
		await connectDatabase();
		const {username, email, password} = await req.json();

		if (!username || !email || !password) {
			return NextResponse.json(
				{message: "Vui lòng nhập đầy đủ thông tin"},
				{status: 400}
			);
		}

		const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
		if (!usernameRegex.test(username)) {
			return NextResponse.json(
				{
					message:
						"Tên đăng nhập phải có ít nhất 3 ký tự và chỉ chứa chữ cái hoặc số",
				},
				{status: 400}
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{message: "Địa chỉ email không hợp lệ"},
				{status: 400}
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{message: "Mật khẩu phải có ít nhất 6 ký tự"},
				{status: 400}
			);
		}

		const userByEmail = await User.findOne({email});
		if (userByEmail) {
			if (userByEmail.isVerified) {
				return NextResponse.json(
					{message: "Email đã được sử dụng"},
					{status: 400}
				);
			}
		}

		const userByUsername = await User.findOne({username});
		if (userByUsername) {
			if (userByUsername.isVerified) {
				return NextResponse.json(
					{message: "Tên đăng nhập đã được sử dụng"},
					{status: 400}
				);
			}
			if (
				userByEmail &&
				userByEmail._id.toString() !== userByUsername._id.toString()
			) {
				return NextResponse.json(
					{message: "Tên đăng nhập đã được sử dụng"},
					{status: 400}
				);
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const hashedOtp = await bcrypt.hash(otp, 10);
		const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

		const avatar = `data:${defaultAvatarData.image.mime};base64,${defaultAvatarData.image.data}`;

		if (userByEmail) {
			userByEmail.username = username;
			userByEmail.password = hashedPassword;
			userByEmail.otp = hashedOtp;
			userByEmail.otpExpires = otpExpires;
			userByEmail.avatar = avatar;
			await userByEmail.save();
		} else {
			await User.create({
				username,
				email,
				password: hashedPassword,
				otp: hashedOtp,
				otpExpires,
				avatar,
				isVerified: false,
			});
		}

		const subject = "Mã xác thực tài khoản - Stingray Lab";
		const html = getVerificationEmailTemplate(username, otp);

		try {
			await sendEmail(email, subject, html);
		} catch (emailError) {
			console.error("Failed to send OTP email:", emailError);
		}

		return NextResponse.json(
			{
				message:
					"Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.",
				email,
			},
			{status: 201}
		);
	} catch (error) {
		console.error("Register error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi đăng ký"},
			{status: 500}
		);
	}
}

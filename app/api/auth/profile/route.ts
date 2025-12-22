import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import User from "@/app/models/User";

export async function PATCH(req: Request) {
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
		};

		await connectDatabase();
		const data = await req.json();

		const user = await User.findById(decoded.userId);

		if (!user) {
			return NextResponse.json(
				{message: "Không tìm thấy người dùng"},
				{status: 404}
			);
		}

		const updateData: Record<string, unknown> = {};

		if (data.username !== undefined && data.username !== user.username) {
			const existingUser = await User.findOne({
				username: data.username,
				_id: {$ne: decoded.userId},
			});

			if (existingUser) {
				return NextResponse.json(
					{message: "Tên người dùng đã được sử dụng"},
					{status: 400}
				);
			}

			if (data.username.length < 3 || data.username.length > 30) {
				return NextResponse.json(
					{message: "Tên người dùng phải từ 3-30 ký tự"},
					{status: 400}
				);
			}

			updateData.username = data.username;
		}

		if (data.avatar !== undefined) {
			updateData.avatar = data.avatar;
		}

		if (data.birthday !== undefined) {
			updateData.birthday = data.birthday
				? new Date(data.birthday)
				: null;
		}

		if (data.location !== undefined) {
			updateData.location = data.location || null;
		}

		if (data.workplace !== undefined) {
			updateData.workplace = data.workplace || null;
		}

		if (data.bio !== undefined) {
			if (data.bio && data.bio.length > 500) {
				return NextResponse.json(
					{message: "Tiểu sử không được vượt quá 500 ký tự"},
					{status: 400}
				);
			}
			updateData.bio = data.bio || null;
		}

		if (data.socialLinks !== undefined) {
			updateData.socialLinks = data.socialLinks || null;
		}

		if (data.visibilitySettings !== undefined) {
			updateData.visibilitySettings = {
				bio: data.visibilitySettings.bio ?? true,
				birthday: data.visibilitySettings.birthday ?? true,
				location: data.visibilitySettings.location ?? true,
				workplace: data.visibilitySettings.workplace ?? true,
				socialLinks: data.visibilitySettings.socialLinks ?? true,
			};
		}

		const updatedUser = await User.findByIdAndUpdate(
			decoded.userId,
			{$set: updateData},
			{new: true, runValidators: true}
		);

		if (!updatedUser) {
			return NextResponse.json(
				{message: "Không thể cập nhật người dùng"},
				{status: 500}
			);
		}

		return NextResponse.json(
			{
				message: "Cập nhật profile thành công",
				user: {
					id: updatedUser._id.toString(),
					username: updatedUser.username,
					email: updatedUser.email,
					avatar: updatedUser.avatar,
					birthday: updatedUser.birthday,
					location: updatedUser.location,
					workplace: updatedUser.workplace,
					bio: updatedUser.bio,
					socialLinks: updatedUser.socialLinks,
					visibilitySettings: updatedUser.visibilitySettings,
					isVerified: updatedUser.isVerified,
					createdAt: updatedUser.createdAt,
				},
			},
			{status: 200}
		);
	} catch (error) {
		console.error("Update profile error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi cập nhật profile"},
			{status: 500}
		);
	}
}

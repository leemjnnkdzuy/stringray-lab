import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDatabase from "@/app/utils/ConnectDB";
import PlotJavascript from "@/app/models/PlotJavascript";
import PlotMathLab from "@/app/models/PlotMathLab";
import PlotMath from "@/app/models/PlotMath";
import User from "@/app/models/User";

export async function GET(
	request: NextRequest,
	{params}: {params: Promise<{id: string}>}
) {
	try {
		const {id: identifier} = await params;
		const {searchParams} = new URL(request.url);
		const pinnedOnly = searchParams.get("pinned") === "true";

		await connectDatabase();

		const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);
		const targetUser = isValidObjectId
			? await User.findById(identifier)
			: await User.findOne({username: identifier});

		if (!targetUser) {
			return NextResponse.json(
				{message: "Không tìm thấy người dùng"},
				{status: 404}
			);
		}

		const targetUserId = targetUser._id.toString();

		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;
		let currentUserId: string | null = null;

		if (accessToken) {
			try {
				const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
				const decoded = jwt.verify(accessToken, jwtSecret) as {
					userId: string;
				};
				currentUserId = decoded.userId;
			} catch {}
		}

		const isOwnProfile = currentUserId === targetUserId;

		let baseFilter: Record<string, unknown> = {userId: targetUserId};

		if (!isOwnProfile) {
			baseFilter.isPublic = true;
		}

		if (pinnedOnly) {
			baseFilter.isPinned = true;
			baseFilter.isPublic = true;
		}

		const selectFields =
			"name description isPublic isPinned createdAt updatedAt";

		const [jsPlots, matlabPlots, mathPlots] = await Promise.all([
			PlotJavascript.find(baseFilter)
				.select(selectFields)
				.sort({updatedAt: -1}),
			PlotMathLab.find(baseFilter)
				.select(selectFields)
				.sort({updatedAt: -1}),
			PlotMath.find(baseFilter)
				.select(selectFields)
				.sort({updatedAt: -1}),
		]);

		const plots = [
			...jsPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				description: p.description,
				type: "javascript" as const,
				isPublic: p.isPublic,
				isPinned: p.isPinned,
				updatedAt: p.updatedAt,
			})),
			...matlabPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				description: p.description,
				type: "matlab" as const,
				isPublic: p.isPublic,
				isPinned: p.isPinned,
				updatedAt: p.updatedAt,
			})),
			...mathPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				description: p.description,
				type: "math" as const,
				isPublic: p.isPublic,
				isPinned: p.isPinned,
				updatedAt: p.updatedAt,
			})),
		].sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() -
				new Date(a.updatedAt).getTime()
		);

		return NextResponse.json(
			{
				plots,
				user: {
					id: targetUser._id.toString(),
					username: targetUser.username,
					avatar: targetUser.avatar,
					cover: targetUser.cover,
					bio: targetUser.bio,
					location: targetUser.location,
					workplace: targetUser.workplace,
					birthday: targetUser.birthday,
					socialLinks: targetUser.socialLinks,
					visibilitySettings: targetUser.visibilitySettings,
					createdAt: targetUser.createdAt,
				},
				isOwnProfile,
			},
			{status: 200}
		);
	} catch (error) {
		console.error("Get user plots error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi lấy danh sách bản vẽ"},
			{status: 500}
		);
	}
}

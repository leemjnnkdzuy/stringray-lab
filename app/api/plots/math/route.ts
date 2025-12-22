import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import PlotMath from "@/app/models/PlotMath";

export async function POST(req: Request) {
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
		const {name, description, isPublic, allowViewSource, allowEdit} =
			await req.json();

		if (!name || !name.trim()) {
			return NextResponse.json(
				{message: "Vui lòng nhập tên bản vẽ"},
				{status: 400}
			);
		}

		const plot = new PlotMath({
			userId: decoded.userId,
			name: name.trim(),
			description: description?.trim() || "",
			isPublic: isPublic ?? false,
			allowViewSource: allowViewSource ?? false,
			allowEdit: allowEdit ?? false,
			expression: "",
		});

		await plot.save();

		return NextResponse.json(
			{
				message: "Tạo bản vẽ thành công",
				plotId: plot._id.toString(),
			},
			{status: 201}
		);
	} catch (error) {
		console.error("Create Math plot error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi tạo bản vẽ"},
			{status: 500}
		);
	}
}

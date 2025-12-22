import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import PlotMath from "@/app/models/PlotMath";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

export async function GET(req: Request, {params}: RouteParams) {
	try {
		const {id} = await params;
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

		const plot = await PlotMath.findById(id);

		if (!plot) {
			return NextResponse.json(
				{message: "Không tìm thấy bản vẽ"},
				{status: 404}
			);
		}

		if (plot.userId.toString() !== decoded.userId && !plot.isPublic) {
			return NextResponse.json(
				{message: "Bạn không có quyền truy cập bản vẽ này"},
				{status: 403}
			);
		}

		return NextResponse.json(
			{
				plot: {
					id: plot._id.toString(),
					name: plot.name,
					description: plot.description,
					isPublic: plot.isPublic,
					allowViewSource: plot.allowViewSource,
					allowEdit: plot.allowEdit,
					expression: plot.expression,
					createdAt: plot.createdAt,
					updatedAt: plot.updatedAt,
				},
			},
			{status: 200}
		);
	} catch (error) {
		console.error("Get Math plot error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi lấy thông tin bản vẽ"},
			{status: 500}
		);
	}
}

export async function PATCH(req: Request, {params}: RouteParams) {
	try {
		const {id} = await params;
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

		const plot = await PlotMath.findById(id);

		if (!plot) {
			return NextResponse.json(
				{message: "Không tìm thấy bản vẽ"},
				{status: 404}
			);
		}

		if (plot.userId.toString() !== decoded.userId) {
			return NextResponse.json(
				{message: "Bạn không có quyền chỉnh sửa bản vẽ này"},
				{status: 403}
			);
		}

		if (data.name !== undefined) plot.name = data.name;
		if (data.description !== undefined) plot.description = data.description;
		if (data.isPublic !== undefined) plot.isPublic = data.isPublic;
		if (data.isPinned !== undefined) plot.isPinned = data.isPinned;
		if (data.allowViewSource !== undefined)
			plot.allowViewSource = data.allowViewSource;
		if (data.allowEdit !== undefined) plot.allowEdit = data.allowEdit;
		if (data.expression !== undefined) plot.expression = data.expression;

		await plot.save();

		return NextResponse.json(
			{
				message: "Cập nhật bản vẽ thành công",
				plot: {
					id: plot._id.toString(),
					name: plot.name,
					description: plot.description,
					isPublic: plot.isPublic,
					allowViewSource: plot.allowViewSource,
					allowEdit: plot.allowEdit,
					expression: plot.expression,
					createdAt: plot.createdAt,
					updatedAt: plot.updatedAt,
				},
			},
			{status: 200}
		);
	} catch (error) {
		console.error("Update Math plot error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi cập nhật bản vẽ"},
			{status: 500}
		);
	}
}

export async function DELETE(req: Request, {params}: RouteParams) {
	try {
		const {id} = await params;
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

		const plot = await PlotMath.findById(id);

		if (!plot) {
			return NextResponse.json(
				{message: "Không tìm thấy bản vẽ"},
				{status: 404}
			);
		}

		if (plot.userId.toString() !== decoded.userId) {
			return NextResponse.json(
				{message: "Bạn không có quyền xóa bản vẽ này"},
				{status: 403}
			);
		}

		await PlotMath.findByIdAndDelete(id);

		return NextResponse.json(
			{message: "Xóa bản vẽ thành công"},
			{status: 200}
		);
	} catch (error) {
		console.error("Delete Math plot error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi xóa bản vẽ"},
			{status: 500}
		);
	}
}

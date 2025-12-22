import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/utils/ConnectDB";
import PlotJavascript from "@/app/models/PlotJavascript";
import PlotMathLab from "@/app/models/PlotMathLab";
import PlotMath from "@/app/models/PlotMath";

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
		};

		await connectDatabase();

		const [jsPlots, matlabPlots, mathPlots] = await Promise.all([
			PlotJavascript.find({userId: decoded.userId}).select("name"),
			PlotMathLab.find({userId: decoded.userId}).select("name"),
			PlotMath.find({userId: decoded.userId}).select("name"),
		]);

		const projects = [
			...jsPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				type: "js" as const,
			})),
			...matlabPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				type: "matlab" as const,
			})),
			...mathPlots.map((p) => ({
				id: p._id.toString(),
				name: p.name,
				type: "math" as const,
			})),
		];

		return NextResponse.json({projects}, {status: 200});
	} catch (error) {
		console.error("Get user projects error:", error);
		return NextResponse.json(
			{message: "Đã xảy ra lỗi khi lấy danh sách dự án"},
			{status: 500}
		);
	}
}

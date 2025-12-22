import api from "@/app/utils/axios";

export type PlotType = "js" | "matlab" | "math";

export interface CreatePlotData {
	name: string;
	description?: string;
	isPublic: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
}

export interface CreatePlotResponse {
	message: string;
	plotId?: string;
}

export interface PlotInfo {
	id: string;
	name: string;
	description?: string;
	isPublic: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
	sourceCode?: string;
	expression?: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetPlotResponse {
	plot?: PlotInfo;
	message?: string;
}

export interface ProjectItem {
	id: string;
	name: string;
	type: PlotType;
}

export interface GetProjectsResponse {
	projects?: ProjectItem[];
	message?: string;
}

const plotEndpoints: Record<PlotType, string> = {
	js: "/plots/javascript",
	matlab: "/plots/matlab",
	math: "/plots/math",
};

export const plotService = {
	async createPlot(
		type: PlotType,
		data: CreatePlotData
	): Promise<CreatePlotResponse> {
		try {
			const endpoint = plotEndpoints[type];
			const res = await api.post(endpoint, data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: CreatePlotResponse};
			};
			return (
				axiosError.response?.data || {message: "Tạo bản vẽ thất bại"}
			);
		}
	},

	async getPlot(type: PlotType, id: string): Promise<GetPlotResponse> {
		try {
			const endpoint = `${plotEndpoints[type]}/${id}`;
			const res = await api.get(endpoint);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: GetPlotResponse};
			};
			return (
				axiosError.response?.data || {
					message: "Lấy thông tin bản vẽ thất bại",
				}
			);
		}
	},

	async getUserProjects(): Promise<GetProjectsResponse> {
		try {
			const res = await api.get("/plots");
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: GetProjectsResponse};
			};
			return (
				axiosError.response?.data || {
					message: "Lấy danh sách dự án thất bại",
				}
			);
		}
	},

	async updatePlot(
		type: PlotType,
		id: string,
		data: Partial<CreatePlotData>
	): Promise<{message: string; plot?: PlotInfo}> {
		try {
			const endpoint = `${plotEndpoints[type]}/${id}`;
			const res = await api.patch(endpoint, data);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message: string}};
			};
			return (
				axiosError.response?.data || {
					message: "Cập nhật bản vẽ thất bại",
				}
			);
		}
	},

	async deletePlot(type: PlotType, id: string): Promise<{message: string}> {
		try {
			const endpoint = `${plotEndpoints[type]}/${id}`;
			const res = await api.delete(endpoint);
			return res.data;
		} catch (error: unknown) {
			const axiosError = error as {
				response?: {data?: {message: string}};
			};
			return (
				axiosError.response?.data || {
					message: "Xóa bản vẽ thất bại",
				}
			);
		}
	},
};

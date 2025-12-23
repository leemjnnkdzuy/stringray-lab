"use client";

import React, {useState, useEffect, Suspense} from "react";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {EditorHeader} from "@/app/components/common/EditorHeader";
import {SettingsData} from "@/app/components/common/SettingsDialog";
import {plotService, PlotInfo} from "@/app/services/plotService";
import {Loader2, Play, Square} from "lucide-react";
import NotFoundPage from "@/app/pages/NotFoundPage";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
	loading: () => (
		<div className='flex items-center justify-center h-full'>
			<Loader2 className='w-6 h-6 text-[#ff79c6] animate-spin' />
		</div>
	),
});

const MatlabCanvas = dynamic(
	() => import("@/app/components/common/MatlabCanvas"),
	{
		ssr: false,
		loading: () => (
			<div className='flex items-center justify-center h-full'>
				<Loader2 className='w-6 h-6 text-[#ff79c6] animate-spin' />
			</div>
		),
	}
);

interface PlotMathLabEditorPageProps {
	plotId?: string;
}

const DEFAULT_CODE = `figure('Position',[300,50,900,900], 'Color','k');
axes(gcf, 'NextPlot','add', 'Position',[0,0,1,1], 'Color','k');
axis([0, 400, 0, 400]); axis off;

% Khởi tạo dữ liệu
num_points = 1e4;
SHdl = scatter([], [], 2, 'filled','o','w', 'MarkerEdgeColor','none', 'MarkerFaceAlpha',0.6);
t = 0;
i = 1:num_points;

% Tạo hình dáng xoắn ốc cơ bản
r_base = sqrt(i) * 1.5;
theta_base = i * (137.5 * pi / 180);

while true
    t = t + 0.02;
    
    r = r_base + 10 .* sin(r_base./20 - t*3);
    theta = theta_base + t/2 + 5./r_base .* sin(t);
    
    x = r .* cos(theta) + 200;
    y = r .* sin(theta) + 200;
    
    SHdl.XData = x;
    SHdl.YData = y;
    SHdl.CData = sin(i'/1000 + t) * 0.5 + 0.5;
    
    drawnow;
end`;

export default function PlotMathLabEditorPage({
	plotId,
}: PlotMathLabEditorPageProps) {
	const router = useRouter();
	const [leftWidth, setLeftWidth] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const [plot, setPlot] = useState<PlotInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const [sourceCode, setSourceCode] = useState("");
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (plotId) {
			loadPlot();
		} else {
			setNotFound(true);
			setLoading(false);
		}
	}, [plotId]);

	const loadPlot = async () => {
		if (!plotId) return;
		setLoading(true);
		try {
			const result = await plotService.getPlot("matlab", plotId);
			if (result.plot) {
				setPlot(result.plot);
				setSourceCode(result.plot.sourceCode || DEFAULT_CODE);
			} else {
				setNotFound(true);
			}
		} catch (error) {
			console.error("Load plot error:", error);
			setNotFound(true);
		} finally {
			setLoading(false);
		}
	};

	const handleMouseDown = () => {
		setIsDragging(true);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		const container = e.currentTarget as HTMLElement;
		const rect = container.getBoundingClientRect();
		const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
		setLeftWidth(Math.min(Math.max(newWidth, 20), 80));
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleRun = () => {
		setIsRunning(true);
	};

	const handleStop = () => {
		setIsRunning(false);
	};

	if (loading) {
		return (
			<div className='flex-1 flex items-center justify-center bg-[#0f0f1a]'>
				<Loader2 className='w-8 h-8 text-[#ff79c6] animate-spin' />
			</div>
		);
	}

	if (notFound) {
		return <NotFoundPage />;
	}

	const handleSaveSettings = async (data: SettingsData) => {
		if (!plot) return;

		try {
			setPlot((prev) => (prev ? {...prev, ...data} : null));
			await plotService.updatePlot("matlab", plot.id, data);
		} catch (error) {
			console.error("Update plot error:", error);
		}
	};

	const handleDeleteProject = async () => {
		if (!plot) return;
		try {
			await plotService.deletePlot("matlab", plot.id);
			router.push("/home");
		} catch (error) {
			console.error("Delete plot error:", error);
		}
	};

	const handleSave = async () => {
		if (!plot) return;
		try {
			await plotService.updatePlot("matlab", plot.id, {sourceCode});
		} catch (error) {
			console.error("Save error:", error);
		}
	};

	return (
		<>
			<EditorHeader
				plotName={plot?.name || "Untitled Plot"}
				plotDescription={plot?.description}
				plotType='matlab'
				onSave={handleSave}
				onRun={handleRun}
				isPublic={plot?.isPublic}
				allowViewSource={plot?.allowViewSource}
				allowEdit={plot?.allowEdit}
				onSaveSettings={handleSaveSettings}
				onDeleteProject={handleDeleteProject}
			/>

			<div
				className='flex-1 flex overflow-hidden'
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<div
					className='h-full bg-[#1e1e2e] border-r border-white/5 flex flex-col'
					style={{width: `${leftWidth}%`}}
				>
					<div className='flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-white/5'>
						<span className='text-white/60 text-sm font-mono'>
							MATLAB Code
						</span>
						<div className='flex gap-2'>
							{isRunning ? (
								<button
									onClick={handleStop}
									className='flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm transition-colors'
								>
									<Square className='w-3.5 h-3.5' />
									Stop
								</button>
							) : (
								<button
									onClick={handleRun}
									className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-md text-sm transition-colors'
								>
									<Play className='w-3.5 h-3.5' />
									Run
								</button>
							)}
						</div>
					</div>
					<div className='flex-1'>
						<Suspense
							fallback={
								<div className='flex items-center justify-center h-full'>
									<Loader2 className='w-6 h-6 text-[#ff79c6] animate-spin' />
								</div>
							}
						>
							<MonacoEditor
								height='100%'
								defaultLanguage='matlab'
								theme='vs-dark'
								value={sourceCode}
								onChange={(value) => setSourceCode(value || "")}
								options={{
									fontSize: 14,
									fontFamily:
										"'JetBrains Mono', 'Fira Code', monospace",
									minimap: {enabled: false},
									scrollBeyondLastLine: false,
									padding: {top: 16, bottom: 16},
									lineNumbers: "on",
									renderLineHighlight: "line",
									cursorBlinking: "smooth",
									smoothScrolling: true,
									wordWrap: "on",
								}}
							/>
						</Suspense>
					</div>
				</div>

				<div
					onMouseDown={handleMouseDown}
					className={`w-1 cursor-col-resize hover:bg-[#ff79c6]/50 transition-colors ${
						isDragging ? "bg-[#ff79c6]" : "bg-transparent"
					}`}
				/>

				<div
					className='h-full bg-[#0f0f1a] overflow-hidden'
					style={{width: `${100 - leftWidth}%`}}
				>
					<div className='h-full flex flex-col'>
						<div className='px-4 py-2 bg-[#181825] border-b border-white/5'>
							<span className='text-white/60 text-sm font-mono'>
								Preview{" "}
								{isRunning && (
									<span className='text-emerald-400 ml-2'>
										● Running
									</span>
								)}
							</span>
						</div>
						<div className='flex-1'>
							{isRunning ? (
								<MatlabCanvas
									code={sourceCode}
									isRunning={isRunning}
									onStop={handleStop}
								/>
							) : (
								<div className='h-full flex items-center justify-center'>
									<div className='text-center'>
										<div className='text-white/20 text-sm mb-4'>
											Nhấn{" "}
											<span className='text-emerald-400'>
												Run
											</span>{" "}
											để chạy code
										</div>
										<button
											onClick={handleRun}
											className='flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm transition-colors mx-auto'
										>
											<Play className='w-4 h-4' />
											Run Code
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

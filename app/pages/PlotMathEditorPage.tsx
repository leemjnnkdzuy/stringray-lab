"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {EditorHeader} from "@/app/components/common/EditorHeader";
import {SettingsData} from "@/app/components/common/SettingsDialog";
import {plotService, PlotInfo} from "@/app/services/plotService";
import {Loader2} from "lucide-react";
import NotFoundPage from "@/app/pages/NotFoundPage";

interface PlotMathEditorPageProps {
	plotId?: string;
}

export default function PlotMathEditorPage({plotId}: PlotMathEditorPageProps) {
	const router = useRouter();
	const [leftWidth, setLeftWidth] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const [plot, setPlot] = useState<PlotInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const [expression, setExpression] = useState("");

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
			const result = await plotService.getPlot("math", plotId);
			if (result.plot) {
				setPlot(result.plot);
				setExpression(result.plot.expression || "");
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

	if (loading) {
		return (
			<div className='flex-1 flex items-center justify-center bg-[#0f0f1a]'>
				<Loader2 className='w-8 h-8 text-[#8be9fd] animate-spin' />
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
			await plotService.updatePlot("math", plot.id, data);
		} catch (error) {
			console.error("Update plot error:", error);
		}
	};

	const handleDeleteProject = async () => {
		if (!plot) return;
		try {
			await plotService.deletePlot("math", plot.id);
			router.push("/home");
		} catch (error) {
			console.error("Delete plot error:", error);
		}
	};

	return (
		<>
			<EditorHeader
				plotName={plot?.name || "Untitled Plot"}
				plotDescription={plot?.description}
				plotType='math'
				onSave={() => console.log("Save")}
				onRun={() => console.log("Run")}
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
					className='h-full bg-[#1a1a2e] border-r border-white/5 overflow-auto'
					style={{width: `${leftWidth}%`}}
				>
					<div className='p-4'>
						<div className='text-white/40 text-sm mb-2 font-mono'>
							// Biểu thức toán học
						</div>
						<textarea
							className='w-full h-[calc(100vh-150px)] bg-transparent text-white font-mono text-sm resize-none focus:outline-none'
							placeholder='Nhập biểu thức toán học của bạn ở đây...'
							spellCheck={false}
							value={expression}
							onChange={(e) => setExpression(e.target.value)}
						/>
					</div>
				</div>

				<div
					onMouseDown={handleMouseDown}
					className={`w-1 cursor-col-resize hover:bg-[#8be9fd]/50 transition-colors ${
						isDragging ? "bg-[#8be9fd]" : "bg-transparent"
					}`}
				/>

				<div
					className='h-full bg-[#0f0f1a] overflow-auto'
					style={{width: `${100 - leftWidth}%`}}
				>
					<div className='p-4 h-full flex items-center justify-center'>
						<div className='text-white/20 text-sm'>
							Preview sẽ hiển thị ở đây
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

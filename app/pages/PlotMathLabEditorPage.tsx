"use client";

import React, {useState} from "react";
import {EditorHeader} from "@/app/components/common/EditorHeader";

export default function PlotMathLabEditorPage() {
	const [leftWidth, setLeftWidth] = useState(50);
	const [isDragging, setIsDragging] = useState(false);

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

	return (
		<>
			<EditorHeader
				plotName='Untitled Plot'
				plotType='js'
				onSave={() => console.log("Save")}
				onRun={() => console.log("Run")}
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
							// Code Editor
						</div>
						<textarea
							className='w-full h-[calc(100vh-150px)] bg-transparent text-white font-mono text-sm resize-none focus:outline-none'
							placeholder='// Viết code của bạn ở đây...'
							spellCheck={false}
						/>
					</div>
				</div>

				<div
					onMouseDown={handleMouseDown}
					className={`w-1 cursor-col-resize hover:bg-[#ff79c6]/50 transition-colors ${
						isDragging ? "bg-[#ff79c6]" : "bg-transparent"
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

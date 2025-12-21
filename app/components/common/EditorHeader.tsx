"use client";

import React from "react";
import {
	ArrowLeft,
	Save,
	Play,
	Settings,
	Loader2,
	ChevronDown,
} from "lucide-react";
import {cn} from "@/app/utils/utils";
import {useRouter} from "next/navigation";

interface EditorHeaderProps {
	plotName: string;
	plotType: "js" | "matlab" | "math";
	isSaving?: boolean;
	onSave?: () => void;
	onRun?: () => void;
}

const typeColors: Record<string, string> = {
	js: "#f1fa8c",
	matlab: "#ff79c6",
	math: "#8be9fd",
};

const typeLabels: Record<string, string> = {
	js: "JavaScript",
	matlab: "MATLAB",
	math: "Công thức",
};

export const EditorHeader = ({
	plotName,
	plotType,
	isSaving = false,
	onSave,
	onRun,
}: EditorHeaderProps) => {
	const router = useRouter();
	const color = typeColors[plotType] || "#ff79c6";

	return (
		<header className='h-[50px] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between'>
			<div className='flex items-center gap-4'>
				<button
					onClick={() => router.back()}
					className='cursor-pointer p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors'
				>
					<ArrowLeft className='w-5 h-5' />
				</button>

				<div className='flex items-center gap-3'>
					<div
						className='w-8 h-8 rounded-lg flex items-center justify-center'
						style={{backgroundColor: `${color}20`}}
					>
						<span className='text-sm font-bold' style={{color}}>
							{plotType === "js"
								? "JS"
								: plotType === "matlab"
								? "M"
								: "∑"}
						</span>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-white font-medium text-sm'>
							{plotName}
						</span>
						<span
							className='px-2 py-0.5 rounded text-xs font-mono'
							style={{
								backgroundColor: `${color}15`,
								color,
							}}
						>
							{typeLabels[plotType]}
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<button
					onClick={onSave}
					disabled={isSaving}
					className={cn(
						"cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
						"bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
					)}
				>
					{isSaving ? (
						<Loader2 className='w-4 h-4 animate-spin' />
					) : (
						<Save className='w-4 h-4' />
					)}
					<span>Lưu</span>
				</button>

				<button
					onClick={onRun}
					className='cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-[#50fa7b]/10 hover:bg-[#50fa7b]/20 text-[#50fa7b] border border-[#50fa7b]/20'
				>
					<Play className='w-4 h-4' />
					<span>Chạy</span>
				</button>

				<button className='cursor-pointer p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors'>
					<Settings className='w-5 h-5' />
				</button>
			</div>
		</header>
	);
};

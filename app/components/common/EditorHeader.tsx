"use client";

import React, {useState, useEffect} from "react";
import {
	Home,
	Save,
	Play,
	Settings,
	Loader2,
	ChevronDown,
	User,
	LogOut,
	FileJson,
	FileCode,
	Sigma,
	Globe,
	Lock,
} from "lucide-react";
import {cn} from "@/app/utils/utils";
import {useRouter} from "next/navigation";
import {useTheme} from "@/app/hooks/useTheme";
import {images} from "@/app/assets";
import Image from "next/image";
import {DropDown} from "@/app/components/ui/DropDown";
import {useAuthContext} from "@/app/context/AuthContext";
import {plotService, ProjectItem, PlotType} from "@/app/services/plotService";
import {SettingsDialog} from "@/app/components/common/SettingsDialog";

import {SettingsData} from "./SettingsDialog";

interface EditorHeaderProps {
	plotName: string;
	plotDescription?: string;
	plotType: "js" | "matlab" | "math";
	isSaving?: boolean;
	isPublic?: boolean;
	allowViewSource?: boolean;
	allowEdit?: boolean;
	onSave?: () => void;
	onRun?: () => void;
	onSaveSettings?: (data: SettingsData) => void;
	onDeleteProject?: () => void;
}

const typeColors: Record<string, string> = {
	js: "#f1fa8c",
	matlab: "#ff79c6",
	math: "#8be9fd",
};

const typeLabels: Record<string, string> = {
	js: ".js",
	matlab: ".m",
	math: "∑",
};

const typeIcons: Record<PlotType, typeof FileJson> = {
	js: FileJson,
	matlab: FileCode,
	math: Sigma,
};

export const EditorHeader = ({
	plotName,
	plotDescription,
	plotType,
	isSaving = false,
	isPublic = false,
	allowViewSource = false,
	allowEdit = false,
	onSave,
	onRun,
	onSaveSettings,
	onDeleteProject,
}: EditorHeaderProps) => {
	const router = useRouter();
	const {theme} = useTheme();
	const {user, logout} = useAuthContext();
	const color = typeColors[plotType] || "#ff79c6";
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [loadingProjects, setLoadingProjects] = useState(true);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		loadProjects();
	}, []);

	const loadProjects = async () => {
		setLoadingProjects(true);
		try {
			const result = await plotService.getUserProjects();
			if (result.projects) {
				setProjects(result.projects);
			}
		} catch (error) {
			console.error("Load projects error:", error);
		} finally {
			setLoadingProjects(false);
		}
	};

	const getEditorUrl = (type: PlotType, id: string): string => {
		const routes: Record<PlotType, string> = {
			js: `/plot/javascript/${id}/edit`,
			matlab: `/plot/matlab/${id}/edit`,
			math: `/plot/math/${id}/edit`,
		};
		return routes[type];
	};

	const handleLogout = async () => {
		try {
			await logout();
			localStorage.removeItem("isLoggedIn");
			router.push("/sign-in");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const projectDropdownItems = projects.map((project) => {
		const Icon = typeIcons[project.type];
		return {
			label: project.name,
			icon: Icon,
			onClick: () => router.push(getEditorUrl(project.type, project.id)),
		};
	});

	return (
		<>
			<header className='h-[50px] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div
						className='flex items-center cursor-pointer'
						onClick={() => router.push("/home")}
					>
						<Image
							src={
								theme === "dark"
									? images.logoWhite
									: images.logoBlack
							}
							alt='Stingray Logo'
							width={32}
							height={32}
							className='w-8 h-8 object-contain'
						/>
					</div>

					<button
						onClick={() => router.push("/home")}
						className='cursor-pointer p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors'
						title='Trang chủ'
					>
						<Home className='w-5 h-5' />
					</button>

					<DropDown
						align='left'
						items={
							loadingProjects
								? [{label: "Đang tải...", onClick: () => {}}]
								: projectDropdownItems.length > 0
								? projectDropdownItems
								: [
										{
											label: "Chưa có dự án nào",
											onClick: () => {},
										},
								  ]
						}
						trigger={
							<button className='cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors text-sm'>
								<span>{plotName}</span>
								<ChevronDown className='w-4 h-4' />
							</button>
						}
					/>
				</div>

				<div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-2'>
					<span className='text-white font-medium text-sm'>
						{plotName}
					</span>
					<span
						className='w-6 h-6 rounded text-xs font-mono flex items-center justify-center leading-none'
						style={{
							backgroundColor: `${color}15`,
							color,
						}}
					>
						{typeLabels[plotType]}
					</span>
					<span
						className={cn(
							"w-6 h-6 flex items-center justify-center rounded",
							isPublic
								? "bg-green-500/10 text-green-400"
								: "bg-white/5 text-white/40"
						)}
						title={isPublic ? "Công khai" : "Riêng tư"}
					>
						{isPublic ? (
							<Globe className='w-3.5 h-3.5' />
						) : (
							<Lock className='w-3.5 h-3.5' />
						)}
					</span>
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

					<button
						onClick={() => setShowSettings(true)}
						className='cursor-pointer p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors'
					>
						<Settings className='w-5 h-5' />
					</button>

					<DropDown
						align='right'
						items={[
							{
								label: "Trang cá nhân",
								icon: User,
								onClick: () => router.push("/profile"),
							},
							{
								label: "Cài đặt",
								icon: Settings,
								onClick: () => router.push("/settings"),
							},
							{
								label: "Đăng xuất",
								icon: LogOut,
								onClick: handleLogout,
								danger: true,
							},
						]}
						trigger={
							<div className='w-9 h-9 rounded-full cursor-pointer overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors'>
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt='User'
										className='w-full h-full object-cover'
									/>
								) : (
									<Loader2 className='w-4 h-4 text-white animate-spin' />
								)}
							</div>
						}
					/>
				</div>
			</header>

			{showSettings && (
				<SettingsDialog
					isOpen={showSettings}
					onClose={() => setShowSettings(false)}
					name={plotName}
					description={plotDescription}
					isPublic={isPublic}
					allowViewSource={allowViewSource}
					allowEdit={allowEdit}
					onSave={(data) => onSaveSettings?.(data)}
					onDelete={() => onDeleteProject?.()}
				/>
			)}
		</>
	);
};

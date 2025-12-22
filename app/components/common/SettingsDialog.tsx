"use client";

import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import {Overlay} from "@/app/components/ui/Overlay";
import {Toggle} from "@/app/components/ui/Toggle";
import {
	Globe,
	Lock,
	Eye,
	Edit3,
	Trash2,
	Save,
	X,
	FileText,
	Shield,
	Settings,
	Smile,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {cn} from "@/app/utils/utils";

export interface SettingsData {
	name: string;
	description?: string;
	isPublic: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
}

interface SettingsDialogProps extends SettingsData {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: SettingsData) => void;
	onDelete: () => void;
}

type TabType = "general" | "privacy" | "settings";

const tabs: {id: TabType; label: string; icon: typeof FileText}[] = [
	{id: "general", label: "Thông tin chung", icon: FileText},
	{id: "privacy", label: "Quyền riêng tư", icon: Shield},
	{id: "settings", label: "Cài đặt chung", icon: Settings},
];

export const SettingsDialog = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	name: initialName,
	description: initialDescription,
	isPublic: initialIsPublic,
	allowViewSource: initialAllowViewSource,
	allowEdit: initialAllowEdit,
}: SettingsDialogProps) => {
	const [activeTab, setActiveTab] = useState<TabType>("general");
	const [formData, setFormData] = useState<SettingsData>({
		name: initialName,
		description: initialDescription || "",
		isPublic: initialIsPublic,
		allowViewSource: initialAllowViewSource,
		allowEdit: initialAllowEdit,
	});

	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteConfirmationName, setDeleteConfirmationName] = useState("");

	useEffect(() => {
		if (isOpen) {
			setIsDeleting(false);
			setDeleteConfirmationName("");
			setFormData({
				name: initialName,
				description: initialDescription || "",
				isPublic: initialIsPublic,
				allowViewSource: initialAllowViewSource,
				allowEdit: initialAllowEdit,
			});
			setActiveTab("general");
		}
	}, [
		isOpen,
		initialName,
		initialDescription,
		initialIsPublic,
		initialAllowViewSource,
		initialAllowEdit,
	]);

	const handleSave = () => {
		onSave(formData);
		onClose();
	};
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiButtonRef = useRef<HTMLButtonElement>(null);
	const [pickerPosition, setPickerPosition] = useState({top: 0, left: 0});

	useEffect(() => {
		if (showEmojiPicker && emojiButtonRef.current) {
			const rect = emojiButtonRef.current.getBoundingClientRect();
			setPickerPosition({
				top: rect.top - 410,
				left: rect.right - 300,
			});
		}
	}, [showEmojiPicker]);

	const onEmojiClick = (emojiData: any) => {
		setFormData((prev) => ({
			...prev,
			description: (prev.description || "") + emojiData.emoji,
		}));
	};

	const renderGeneralTab = () => (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<label className='text-sm font-medium text-white/70'>
					Tên dự án
				</label>
				<input
					type='text'
					value={formData.name}
					onChange={(e) =>
						setFormData({...formData, name: e.target.value})
					}
					className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6]/50 focus:ring-1 focus:ring-[#ff79c6]/50 transition-all'
					placeholder='Nhập tên dự án...'
				/>
			</div>
			<div className='space-y-2 relative'>
				<label className='text-sm font-medium text-white/70'>
					Mô tả
				</label>
				<div className='relative'>
					<textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({
								...formData,
								description: e.target.value,
							})
						}
						rows={6}
						className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6]/50 focus:ring-1 focus:ring-[#ff79c6]/50 transition-all resize-none'
						placeholder='Nhập mô tả dự án...'
					/>
					<button
						ref={emojiButtonRef}
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						className='absolute bottom-3 right-3 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors'
					>
						<Smile className='w-5 h-5' />
					</button>
					{showEmojiPicker &&
						ReactDOM.createPortal(
							<>
								<div
									className='fixed inset-0 z-[9998]'
									onClick={() => setShowEmojiPicker(false)}
								/>
								<div
									className='fixed z-[9999] shadow-2xl rounded-xl overflow-hidden'
									style={{
										top: pickerPosition.top,
										left: pickerPosition.left,
									}}
								>
									<EmojiPicker
										onEmojiClick={onEmojiClick}
										theme={"dark" as any}
										width={300}
										height={400}
									/>
								</div>
							</>,
							document.body
						)}
				</div>
			</div>
		</div>
	);

	const renderPrivacyTab = () => (
		<div className='space-y-4'>
			<div className='flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-white/5'>
						{formData.isPublic ? (
							<Globe className='w-5 h-5 text-[#8be9fd]' />
						) : (
							<Lock className='w-5 h-5 text-[#ff5555]' />
						)}
					</div>
					<div>
						<p className='text-white font-medium text-sm'>
							Công khai
						</p>
						<p className='text-xs text-white/40'>
							{formData.isPublic
								? "Mọi người có thể xem"
								: "Chỉ mình bạn thấy"}
						</p>
					</div>
				</div>
				<Toggle
					checked={formData.isPublic}
					onChange={(checked) =>
						setFormData({...formData, isPublic: checked})
					}
				/>
			</div>

			<div
				className={cn(
					"flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all duration-300",
					formData.isPublic
						? "bg-white/5 opacity-100"
						: "bg-white/5 opacity-50 pointer-events-none grayscale"
				)}
			>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-white/5'>
						<Eye className='w-5 h-5 text-[#f1fa8c]' />
					</div>
					<div>
						<p className='text-white font-medium text-sm'>
							Xem mã nguồn
						</p>
						<p className='text-xs text-white/40'>
							Cho phép xem code
						</p>
					</div>
				</div>
				<Toggle
					checked={formData.isPublic && formData.allowViewSource}
					onChange={(checked) =>
						setFormData({...formData, allowViewSource: checked})
					}
				/>
			</div>

			<div
				className={cn(
					"flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all duration-300",
					formData.isPublic && formData.allowViewSource
						? "bg-white/5 opacity-100"
						: "bg-white/5 opacity-50 pointer-events-none grayscale"
				)}
			>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-white/5'>
						<Edit3 className='w-5 h-5 text-[#50fa7b]' />
					</div>
					<div>
						<p className='text-white font-medium text-sm'>
							Cho phép sửa
						</p>
						<p className='text-xs text-white/40'>
							Cho phép fork & sửa
						</p>
					</div>
				</div>
				<Toggle
					checked={
						formData.isPublic &&
						formData.allowViewSource &&
						formData.allowEdit
					}
					onChange={(checked) =>
						setFormData({...formData, allowEdit: checked})
					}
				/>
			</div>
		</div>
	);

	const renderSettingsTab = () => (
		<div className='space-y-6'>
			<div className='p-4 rounded-xl bg-[#ff5555]/5 border border-[#ff5555]/20'>
				<div className='flex items-center justify-between'>
					<div className='space-y-1'>
						<h3 className='text-sm font-medium text-[#ff5555]'>
							Xóa dự án
						</h3>
						<p className='text-xs text-white/40'>
							Hành động này không thể hoàn tác. Toàn bộ dữ liệu sẽ
							bị xóa vĩnh viễn.
						</p>
					</div>
					<button
						onClick={() => setIsDeleting(true)}
						className='px-4 py-2 rounded-lg bg-[#ff5555]/10 hover:bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/20 flex items-center gap-2 transition-all text-sm font-medium'
					>
						<Trash2 className='w-4 h-4' />
						<span>Xóa dự án</span>
					</button>
				</div>
			</div>
		</div>
	);

	const renderDeleteConfirmation = () => (
		<div className='flex flex-col h-full justify-center space-y-6 max-w-lg mx-auto'>
			<div className='text-center space-y-2'>
				<div className='w-12 h-12 rounded-full bg-[#ff5555]/10 flex items-center justify-center mx-auto mb-4'>
					<Trash2 className='w-6 h-6 text-[#ff5555]' />
				</div>
				<h3 className='text-xl font-bold text-white'>
					Xác nhận xóa dự án
				</h3>
				<p className='text-white/60 text-sm'>
					Hành động này không thể hoàn tác. Để xác nhận, vui lòng nhập
					tên dự án{" "}
					<span className='text-white font-bold'>
						{formData.name}
					</span>{" "}
					bên dưới.
				</p>
			</div>

			<input
				type='text'
				value={deleteConfirmationName}
				onChange={(e) => setDeleteConfirmationName(e.target.value)}
				className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ff5555]/50 focus:ring-1 focus:ring-[#ff5555]/50 transition-all text-center'
				placeholder='Nhập tên dự án...'
				autoFocus
			/>

			<div className='flex gap-3'>
				<button
					onClick={() => {
						setIsDeleting(false);
						setDeleteConfirmationName("");
					}}
					className='flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-medium'
				>
					Hủy bỏ
				</button>
				<button
					onClick={onDelete}
					disabled={deleteConfirmationName !== formData.name}
					className='flex-1 px-4 py-2.5 rounded-lg bg-[#ff5555] hover:bg-[#ff5555]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all text-sm shadow-lg shadow-[#ff5555]/20'
				>
					Xóa vĩnh viễn
				</button>
			</div>
		</div>
	);

	const renderContent = () => {
		switch (activeTab) {
			case "general":
				return renderGeneralTab();
			case "privacy":
				return renderPrivacyTab();
			case "settings":
				return renderSettingsTab();
			default:
				return null;
		}
	};

	return (
		<Overlay isOpen={isOpen} onClose={onClose}>
			<div className='bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-[50vw] max-w-4xl max-h-[80vh] flex flex-col'>
				<div className='flex items-center justify-between px-6 py-4'>
					<h2 className='text-lg font-semibold text-white'>
						Cài đặt dự án
					</h2>
				</div>

				<div className='flex flex-1 overflow-hidden min-h-[400px]'>
					<div className='w-48 p-3 space-y-1'>
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer",
										activeTab === tab.id
											? "bg-white/10 text-white"
											: "text-white/50 hover:text-white hover:bg-white/5"
									)}
								>
									<Icon className='w-4 h-4' />
									<span>{tab.label}</span>
								</button>
							);
						})}
					</div>

					<div className='flex-1 px-6 overflow-hidden'>
						{!isDeleting ? (
							<div
								className='w-full h-full animate-in fade-in slide-in-from-left-4 duration-300'
								key='settings-content'
							>
								{renderContent()}
							</div>
						) : (
							<div
								className='w-full h-full animate-in fade-in slide-in-from-right-4 duration-300'
								key='delete-confirmation'
							>
								{renderDeleteConfirmation()}
							</div>
						)}
					</div>
				</div>

				{!isDeleting && (
					<div className='flex items-center justify-end gap-3 px-6 py-4'>
						<button
							onClick={onClose}
							className='px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-medium flex items-center gap-2'
						>
							<X className='w-4 h-4' />
							<span>Hủy</span>
						</button>
						<button
							onClick={handleSave}
							className='px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-[#0a0a0a] font-bold transition-all text-sm flex items-center gap-2'
						>
							<Save className='w-4 h-4' />
							<span>Lưu thay đổi</span>
						</button>
					</div>
				)}
			</div>
		</Overlay>
	);
};

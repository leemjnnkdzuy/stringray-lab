"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {
	Activity,
	FileCode,
	FileJson,
	Sigma,
	ArrowRight,
	ArrowLeft,
	Layout,
	Eye,
	Edit3,
	Globe,
	Lock,
} from "lucide-react";
import {Button} from "@/app/components/ui/Button";
import {TextInput} from "@/app/components/ui/TextInput";
import {Toggle} from "@/app/components/ui/Toggle";
import {cn} from "@/app/utils/utils";

type PlotType = "js" | "matlab" | "math";

interface PlotTypeOption {
	id: PlotType;
	label: string;
	description: string;
	icon: React.ElementType;
	color: string;
	tag: string;
}

const plotTypes: PlotTypeOption[] = [
	{
		id: "js",
		label: "JavaScript",
		description: "Tạo bản vẽ với JavaScript, ES6+",
		icon: FileJson,
		color: "#f1fa8c",
		tag: ".js",
	},
	{
		id: "matlab",
		label: "MATLAB",
		description: "Mô phỏng toán học với MATLAB",
		icon: FileCode,
		color: "#ff79c6",
		tag: ".m",
	},
	{
		id: "math",
		label: "Công thức",
		description: "Từ các biểu thức toán học tạo ra các vector có thể vẽ",
		icon: Sigma,
		color: "#8be9fd",
		tag: "Biểu thức",
	},
];

export default function CreatePlotPage() {
	const router = useRouter();
	const [phase, setPhase] = useState<1 | 2>(1);
	const [plotType, setPlotType] = useState<PlotType | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	const [allowViewSource, setAllowViewSource] = useState(false);
	const [allowEdit, setAllowEdit] = useState(false);

	const handleSelectType = (type: PlotType) => {
		setPlotType(type);
		setPhase(2);
	};

	const handleCreate = () => {
		console.log("Creating plot:", {
			type: plotType,
			name,
			description,
			isPublic,
			allowViewSource,
			allowEdit,
		});
		router.push("/plot-editor");
	};

	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				staggerChildren: 0.05,
				staggerDirection: -1,
			},
		},
	};

	const itemVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				type: "spring" as const,
				stiffness: 300,
				damping: 24,
			},
		},
		exit: {opacity: 0},
	};

	const selectedType = plotTypes.find((t) => t.id === plotType);

	return (
		<div className='min-h-[calc(100vh-65px)] flex items-center justify-center p-6 relative overflow-hidden'>
			<div className='w-full max-w-6xl'>
				<AnimatePresence mode='wait'>
					{phase === 1 ? (
						<motion.div
							key='phase1'
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							exit='exit'
							className='space-y-12 max-w-5xl mx-auto'
						>
							<motion.div
								variants={itemVariants}
								className='text-center space-y-4'
							>
								<h1 className='text-4xl font-bold text-white'>
									Chọn loại bản vẽ
								</h1>
								<p className='text-white/60 text-lg'>
									Bạn muốn bắt đầu sáng tạo với công cụ nào?
								</p>
							</motion.div>

							<motion.div
								variants={containerVariants}
								className='grid grid-cols-1 md:grid-cols-3 gap-6'
							>
								{plotTypes.map((type) => (
									<motion.div
										key={type.id}
										variants={itemVariants}
										onClick={() =>
											handleSelectType(type.id)
										}
										className='group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden'
									>
										<div
											className='absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500'
											style={{
												backgroundColor: type.color,
											}}
										/>

										<div className='absolute top-4 right-4'>
											<span
												className='px-3 py-1 rounded-full text-xs font-mono font-medium border'
												style={{
													borderColor: `${type.color}40`,
													backgroundColor: `${type.color}10`,
													color: type.color,
												}}
											>
												{type.tag}
											</span>
										</div>

										<div className='flex flex-col items-start text-left gap-6 relative z-10'>
											<div
												className='w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg'
												style={{
													backgroundColor: `${type.color}20`,
												}}
											>
												<type.icon
													className='w-8 h-8'
													style={{
														color: type.color,
													}}
												/>
											</div>
											<div className='space-y-2'>
												<h3 className='text-xl font-semibold text-white group-hover:text-white transition-colors'>
													{type.label}
												</h3>
												<p className='text-white/50 text-sm group-hover:text-white/70 transition-colors'>
													{type.description}
												</p>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					) : (
						<motion.div
							key='phase2'
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							exit='exit'
							className='w-full'
						>
							<motion.div
								variants={itemVariants}
								className='flex items-center gap-4 mb-8'
							>
								<button
									onClick={() => setPhase(1)}
									className='cursor-pointer p-2 rounded-full text-white/50 hover:text-white transition-colors flex items-center gap-2 group'
								>
									<ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
									<span className='font-medium'>
										Quay lại
									</span>
								</button>
							</motion.div>

							<div className='grid grid-cols-1 md:grid-cols-12 gap-8 items-start'>
								<motion.div
									variants={itemVariants}
									className='md:col-span-7 space-y-6'
								>
									<div className='bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-6'>
										<div>
											<h2 className='text-2xl font-bold text-white mb-2'>
												Thông tin dự án
											</h2>
											<p className='text-white/50'>
												Đặt tên và mô tả cho tác phẩm
												của bạn
											</p>
										</div>

										<div className='space-y-6'>
											<TextInput
												label='Tên bản vẽ'
												placeholder='Ví dụ: Sóng hình sin...'
												value={name}
												onChange={(e) =>
													setName(e.target.value)
												}
												icon={Layout}
												autoFocus
												className='bg-black/20'
											/>

											<div className='space-y-2'>
												<label className='text-sm font-medium text-white/70 ml-1'>
													Mô tả (Tùy chọn)
												</label>
												<textarea
													value={description}
													onChange={(e) =>
														setDescription(
															e.target.value
														)
													}
													placeholder='Mô tả ngắn về tác phẩm của bạn...'
													className='w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#ff79c6]/50 focus:border-transparent transition-all resize-none h-40'
												/>
											</div>
										</div>
									</div>

									<div className='hidden md:block'>
										<Button
											onClick={handleCreate}
											disabled={!name.trim()}
											className='w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] hover:!scale-100 text-lg bg-gradient-to-r from-[#bd93f9] to-[#ff79c6]'
										>
											Khởi tạo dự án
											<ArrowRight className='w-6 h-6 ml-2' />
										</Button>
									</div>
								</motion.div>

								{/* Right Column: Settings */}
								<motion.div
									variants={itemVariants}
									className='md:col-span-5 space-y-6'
								>
									{/* Selected Type Card */}
									{selectedType && (
										<div className='bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md overflow-hidden relative group'>
											<div
												className='absolute inset-0 opacity-10'
												style={{
													backgroundColor:
														selectedType.color,
												}}
											/>
											<div className='relative z-10 flex items-center gap-5'>
												<div
													className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'
													style={{
														backgroundColor: `${selectedType.color}20`,
														border: `1px solid ${selectedType.color}40`,
													}}
												>
													<selectedType.icon
														className='w-8 h-8'
														style={{
															color: selectedType.color,
														}}
													/>
												</div>
												<div>
													<p className='text-sm text-white/50 mb-1'>
														Loại bản vẽ đã chọn
													</p>
													<h3 className='text-xl font-bold text-white'>
														{selectedType.label}
													</h3>
												</div>
												<button
													className='ml-auto text-sm text-white/40 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/5'
													onClick={() => setPhase(1)}
												>
													Thay đổi
												</button>
											</div>
										</div>
									)}

									<div className='bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6'>
										<div>
											<h3 className='text-lg font-bold text-white mb-1'>
												Cài đặt quyền riêng tư
											</h3>
											<p className='text-sm text-white/50'>
												Quản lý ai có thể xem và chỉnh
												sửa
											</p>
										</div>

										<div className='space-y-4'>
											<div className='flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5'>
												<div className='flex items-center gap-3'>
													<div className='p-2 rounded-lg bg-white/5'>
														{isPublic ? (
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
															{isPublic
																? "Mọi người đều có thể xem"
																: "Chỉ mình bạn thấy"}
														</p>
													</div>
												</div>
												<Toggle
													checked={isPublic}
													onChange={(checked) => {
														setIsPublic(checked);
														if (!checked) {
															setAllowViewSource(
																false
															);
															setAllowEdit(false);
														}
													}}
												/>
											</div>

											{isPublic && (
												<motion.div
													initial={{
														opacity: 0,
														height: 0,
													}}
													animate={{
														opacity: 1,
														height: "auto",
													}}
													className='space-y-4'
												>
													<div className='flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 ml-4 relative'>
														<div className='absolute left-[-16px] top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/10' />
														<div className='flex items-center gap-3'>
															<div className='p-2 rounded-lg bg-white/5'>
																<Eye className='w-5 h-5 text-[#f1fa8c]' />
															</div>
															<div>
																<p className='text-white font-medium text-sm'>
																	Xem mã nguồn
																</p>
																<p className='text-xs text-white/40'>
																	Cho phép xem
																	code
																</p>
															</div>
														</div>
														<Toggle
															checked={
																allowViewSource
															}
															onChange={(
																checked
															) => {
																setAllowViewSource(
																	checked
																);
																if (!checked) {
																	setAllowEdit(
																		false
																	);
																}
															}}
														/>
													</div>

													{allowViewSource && (
														<div className='flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 ml-8 relative'>
															<div className='absolute left-[-16px] top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/10' />
															<div className='flex items-center gap-3'>
																<div className='p-2 rounded-lg bg-white/5'>
																	<Edit3 className='w-5 h-5 text-[#50fa7b]' />
																</div>
																<div>
																	<p className='text-white font-medium text-sm'>
																		Cho phép
																		sửa
																	</p>
																	<p className='text-xs text-white/40'>
																		Cho phép
																		fork &
																		sửa
																	</p>
																</div>
															</div>
															<Toggle
																checked={
																	allowEdit
																}
																onChange={
																	setAllowEdit
																}
															/>
														</div>
													)}
												</motion.div>
											)}
										</div>
									</div>

									{/* Mobile Only Button */}
									<div className='md:hidden pt-4'>
										<Button
											onClick={handleCreate}
											disabled={!name.trim()}
											className='w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] hover:!scale-100 text-lg bg-gradient-to-r from-[#bd93f9] to-[#ff79c6]'
										>
											Khởi tạo dự án
											<ArrowRight className='w-6 h-6 ml-2' />
										</Button>
									</div>
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

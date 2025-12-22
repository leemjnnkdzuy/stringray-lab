"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {
	Camera,
	MapPin,
	Briefcase,
	Calendar,
	Mail,
	Edit3,
	Users,
	LineChart,
	FileText,
	Loader2,
	Lock,
	Globe,
	Pin,
	Github,
	Linkedin,
	Instagram,
	Twitter,
	Facebook,
	Link,
	Cake,
} from "lucide-react";
import {useAuthContext} from "@/app/context/AuthContext";
import {Button} from "@/app/components/ui/Button";
import {userService} from "@/app/services/userService";

type TabType = "overview" | "plots";

interface Plot {
	id: string;
	name: string;
	description?: string;
	type: "javascript" | "matlab" | "math";
	isPublic: boolean;
	isPinned: boolean;
	updatedAt: string;
}

interface ProfileData {
	plots: Plot[];
	user: {
		id: string;
		username: string;
		avatar?: string;
	};
	isOwnProfile: boolean;
}

const tabs: {id: TabType; label: string; icon: typeof FileText}[] = [
	{id: "overview", label: "Tổng quan", icon: FileText},
	{id: "plots", label: "Bản vẽ", icon: LineChart},
];

const typeLabels: Record<string, string> = {
	javascript: "JavaScript",
	matlab: "MATLAB",
	math: "Math",
};

const typeColors: Record<string, string> = {
	javascript: "bg-yellow-500/20 text-yellow-400",
	matlab: "bg-orange-500/20 text-orange-400",
	math: "bg-blue-500/20 text-blue-400",
};

interface ProfilePageProps {
	plotId?: string;
}

export default function ProfilePage({plotId}: ProfilePageProps) {
	const router = useRouter();
	const {user, loading: authLoading} = useAuthContext();
	const [activeTab, setActiveTab] = useState<TabType>("overview");
	const [pinnedPlots, setPinnedPlots] = useState<Plot[]>([]);
	const [allPlots, setAllPlots] = useState<Plot[]>([]);
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [pinningPlotId, setPinningPlotId] = useState<string | null>(null);

	const targetUserId = plotId || user?.id;

	useEffect(() => {
		const fetchPlots = async () => {
			if (!targetUserId) return;

			setLoading(true);
			try {
				const [pinnedRes, allRes] = await Promise.all([
					userService.getUserPlots(targetUserId, true),
					userService.getUserPlots(targetUserId),
				]);

				setPinnedPlots(pinnedRes.plots);
				setAllPlots(allRes.plots);
				setProfileData(allRes);
			} catch (error) {
				console.error("Error fetching plots:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPlots();
	}, [targetUserId]);

	const handlePlotClick = (plot: Plot) => {
		router.push(`/plot/${plot.type}/${plot.id}/edit`);
	};

	const handleTogglePin = async (plot: Plot) => {
		setPinningPlotId(plot.id);
		try {
			await userService.togglePlotPin(plot.type, plot.id, !plot.isPinned);
			if (plot.isPinned) {
				setPinnedPlots((prev) => prev.filter((p) => p.id !== plot.id));
			} else {
				setPinnedPlots((prev) => [...prev, {...plot, isPinned: true}]);
			}
			setAllPlots((prev) =>
				prev.map((p) =>
					p.id === plot.id ? {...p, isPinned: !p.isPinned} : p
				)
			);
		} catch (error) {
			console.error("Error toggling pin:", error);
		} finally {
			setPinningPlotId(null);
		}
	};

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-black text-white flex items-center justify-center'>
				<Loader2 className='w-8 h-8 animate-spin text-white/50' />
			</div>
		);
	}

	const displayUser = profileData?.user || user;
	const isOwnProfile = profileData?.isOwnProfile ?? true;
	const currentPlots = activeTab === "overview" ? pinnedPlots : allPlots;

	const renderPlotCard = (plot: Plot, index: number) => (
		<motion.div
			key={plot.id}
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{delay: 0.05 * index}}
			onClick={() => handlePlotClick(plot)}
			className='p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group'
		>
			<div className='flex items-start justify-between mb-2'>
				<h4 className='text-white font-medium group-hover:text-[#ff79c6] transition-colors'>
					{plot.name}
				</h4>
				{plot.isPublic && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleTogglePin(plot);
						}}
						disabled={pinningPlotId === plot.id}
						className={`p-1.5 rounded-lg transition-all cursor-pointer ${
							plot.isPinned
								? "bg-[#ff79c6]/20 text-[#ff79c6] hover:bg-[#ff79c6]/30"
								: "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
						} ${
							pinningPlotId === plot.id
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						title={plot.isPinned ? "Bỏ ghim" : "Ghim"}
					>
						{pinningPlotId === plot.id ? (
							<Loader2 className='w-3.5 h-3.5 animate-spin' />
						) : (
							<Pin className='w-3.5 h-3.5' />
						)}
					</button>
				)}
			</div>
			{plot.description && (
				<p className='text-white/50 text-sm mb-3 line-clamp-2'>
					{plot.description}
				</p>
			)}
			<div className='flex items-center gap-2'>
				{plot.isPublic ? (
					<Globe className='w-3.5 h-3.5 text-green-400' />
				) : (
					<Lock className='w-3.5 h-3.5 text-white/40' />
				)}
				<span
					className={`text-xs px-2 py-0.5 rounded-full ${
						typeColors[plot.type]
					}`}
				>
					{typeLabels[plot.type]}
				</span>
				<span className='text-xs text-white/30'>
					{new Date(plot.updatedAt).toLocaleDateString("vi-VN")}
				</span>
			</div>
		</motion.div>
	);

	const renderOverviewTab = () => (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			<div className='space-y-4'>
				<motion.div
					initial={{opacity: 0, y: 20}}
					animate={{opacity: 1, y: 0}}
				>
					{user?.bio && user.visibilitySettings?.bio !== false && (
						<p className='text-white/70 text-sm mb-4'>{user.bio}</p>
					)}
					<h3 className='text-lg font-semibold text-white mb-4'>
						Giới thiệu
					</h3>
					<div className='space-y-3'>
						{user?.workplace &&
							user.visibilitySettings?.workplace !== false && (
								<div className='flex items-center gap-3 text-white/70'>
									<Briefcase className='w-5 h-5 text-white/40' />
									<span className='text-sm'>
										Làm việc tại {user.workplace}
									</span>
								</div>
							)}
						{user?.location &&
							user.visibilitySettings?.location !== false && (
								<div className='flex items-center gap-3 text-white/70'>
									<MapPin className='w-5 h-5 text-white/40' />
									<span className='text-sm'>
										Đến từ {user.location}
									</span>
								</div>
							)}
						{user?.birthday &&
							user.visibilitySettings?.birthday !== false && (
								<div className='flex items-center gap-3 text-white/70'>
									<Cake className='w-5 h-5 text-white/40' />
									<span className='text-sm'>
										Sinh ngày{" "}
										{new Date(
											user.birthday
										).toLocaleDateString("vi-VN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>
							)}
						{isOwnProfile && user?.email && (
							<div className='flex items-center gap-3 text-white/70'>
								<Mail className='w-5 h-5 text-white/40' />
								<span className='text-sm'>{user.email}</span>
							</div>
						)}
						<div className='flex items-center gap-3 text-white/70'>
							<Calendar className='w-5 h-5 text-white/40' />
							<span className='text-sm'>
								Tham gia{" "}
								{user?.createdAt
									? new Date(
											user.createdAt
									  ).toLocaleDateString("vi-VN", {
											month: "long",
											year: "numeric",
									  })
									: ""}
							</span>
						</div>
						{user?.socialLinks &&
							Object.values(user.socialLinks).some((v) => v) && (
								<div className='pt-3'>
									<div className='flex items-center gap-2 flex-wrap'>
										{user.socialLinks.facebook &&
											user.visibilitySettings?.socialLinks
												?.facebook !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.facebook,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Facebook className='w-4 h-4 text-white/60' />
												</div>
											)}
										{user.socialLinks.twitter &&
											user.visibilitySettings?.socialLinks
												?.twitter !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.twitter,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Twitter className='w-4 h-4 text-white/60' />
												</div>
											)}
										{user.socialLinks.github &&
											user.visibilitySettings?.socialLinks
												?.github !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.github,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Github className='w-4 h-4 text-white/60' />
												</div>
											)}
										{user.socialLinks.linkedin &&
											user.visibilitySettings?.socialLinks
												?.linkedin !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.linkedin,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Linkedin className='w-4 h-4 text-white/60' />
												</div>
											)}
										{user.socialLinks.instagram &&
											user.visibilitySettings?.socialLinks
												?.instagram !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.instagram,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Instagram className='w-4 h-4 text-white/60' />
												</div>
											)}
										{user.socialLinks.website &&
											user.visibilitySettings?.socialLinks
												?.website !== false && (
												<div
													onClick={() =>
														window.open(
															user.socialLinks!
																.website,
															"_blank"
														)
													}
													className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
												>
													<Globe className='w-4 h-4 text-white/60' />
												</div>
											)}
									</div>
								</div>
							)}
					</div>
				</motion.div>
			</div>
			<div className='lg:col-span-2 space-y-4'>
				{pinnedPlots.length === 0 ? (
					<div className='p-8 rounded-xl text-center'>
						<Pin className='w-8 h-8 text-white/20 mx-auto mb-2' />
						<p className='text-white/50 text-sm'>
							{isOwnProfile
								? "Bạn chưa ghim bản vẽ nào. Ghim các bản vẽ public để hiển thị ở đây."
								: "Người dùng chưa ghim bản vẽ nào."}
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{pinnedPlots.map((plot, index) =>
							renderPlotCard(plot, index)
						)}
					</div>
				)}
			</div>
		</div>
	);

	const renderPlotsTab = () => (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold text-white'>
					Tất cả bản vẽ ({allPlots.length})
				</h3>
			</div>
			{allPlots.length === 0 ? (
				<div className='p-8 rounded-xl text-center'>
					<LineChart className='w-8 h-8 text-white/20 mx-auto mb-2' />
					<p className='text-white/50 text-sm'>
						{isOwnProfile
							? "Bạn chưa có bản vẽ nào."
							: "Người dùng chưa có bản vẽ public nào."}
					</p>
				</div>
			) : (
				<div className='flex flex-col gap-4'>
					{allPlots.map((plot, index) => renderPlotCard(plot, index))}
				</div>
			)}
		</div>
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return renderOverviewTab();
			case "plots":
				return renderPlotsTab();

			default:
				return null;
		}
	};

	return (
		<div className='min-h-[calc(100vh-65px)] bg-black text-white'>
			<div className='relative h-[300px] md:h-[400px] w-full'>
				<div className='absolute inset-0 bg-gradient-to-br from-[#ff79c6]/30 via-[#bd93f9]/20 to-[#8be9fd]/30' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
			</div>

			<div className='max-w-5xl mx-auto px-4 -mt-20 relative z-10'>
				<div className='flex flex-col md:flex-row md:items-end gap-4'>
					<div className='relative'>
						<div className='w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-black bg-black overflow-hidden'>
							{displayUser?.avatar ? (
								<img
									src={displayUser.avatar}
									alt='Avatar'
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] flex items-center justify-center'>
									<span className='text-4xl font-bold text-white'>
										{displayUser?.username
											?.charAt(0)
											?.toUpperCase() || "U"}
									</span>
								</div>
							)}
						</div>
					</div>

					<div className='flex-1 pb-4'>
						<h1 className='text-2xl md:text-3xl font-bold text-white'>
							{displayUser?.username || "Người dùng"}
						</h1>
						<p className='text-white/50 text-sm mt-1'>
							{allPlots.length} bản vẽ • {pinnedPlots.length} được
							ghim
						</p>
					</div>

					{isOwnProfile && (
						<div className='flex gap-2 pb-4'>
							<Button
								onClick={() => router.push("/profile/edit")}
								className='bg-[#ff79c6] hover:bg-[#ff79c6]/90 text-white font-medium'
							>
								<Edit3 className='w-4 h-4 mr-2' />
								Chỉnh sửa
							</Button>
						</div>
					)}
				</div>

				<div className='mt-4 border-t border-white/10'>
					<div className='flex gap-1 -mb-px overflow-x-auto'>
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
										activeTab === tab.id
											? "text-[#ff79c6] border-[#ff79c6]"
											: "text-white/50 border-transparent hover:text-white hover:bg-white/5"
									}`}
								>
									<Icon className='w-4 h-4' />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className='max-w-5xl mx-auto px-4 py-6'>
				{renderTabContent()}
			</div>
		</div>
	);
}

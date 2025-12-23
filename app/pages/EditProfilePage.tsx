"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {
	Camera,
	Loader2,
	Save,
	Calendar,
	ArrowLeft,
	MapPin,
	Briefcase,
	FileText,
	Link,
	Github,
	Linkedin,
	Instagram,
	Globe,
	Twitter,
	Facebook,
	Eye,
} from "lucide-react";
import {useAuthContext} from "@/app/context/AuthContext";
import {Button} from "@/app/components/ui/Button";
import {DateInput} from "@/app/components/ui/DateInput";
import {Toggle} from "@/app/components/ui/Toggle";
import {AvatarUploadOverlay} from "@/app/components/common/AvatarUploadOverlay";
import {CoverUploadOverlay} from "@/app/components/common/CoverUploadOverlay";
import {profileService} from "@/app/services/profileService";

interface SocialLinksVisibility {
	facebook: boolean;
	twitter: boolean;
	github: boolean;
	linkedin: boolean;
	instagram: boolean;
	website: boolean;
}

interface VisibilitySettings {
	bio: boolean;
	birthday: boolean;
	location: boolean;
	workplace: boolean;
	socialLinks: SocialLinksVisibility;
}

export default function EditProfilePage() {
	const router = useRouter();
	const {user, loading: authLoading, refreshUser} = useAuthContext();
	const [birthday, setBirthday] = useState("");
	const [location, setLocation] = useState("");
	const [workplace, setWorkplace] = useState("");
	const [bio, setBio] = useState("");
	const [socialLinks, setSocialLinks] = useState({
		facebook: "",
		twitter: "",
		github: "",
		linkedin: "",
		instagram: "",
		website: "",
	});
	const [visibilitySettings, setVisibilitySettings] =
		useState<VisibilitySettings>({
			bio: true,
			birthday: true,
			location: true,
			workplace: true,
			socialLinks: {
				facebook: true,
				twitter: true,
				github: true,
				linkedin: true,
				instagram: true,
				website: true,
			},
		});
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [avatarOverlayOpen, setAvatarOverlayOpen] = useState(false);
	const [coverOverlayOpen, setCoverOverlayOpen] = useState(false);
	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	const [cover, setCover] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (user) {
			setBirthday(user.birthday ? user.birthday.split("T")[0] : "");
			setLocation(user.location || "");
			setWorkplace(user.workplace || "");
			setBio(user.bio || "");
			if (user.socialLinks) {
				setSocialLinks({
					facebook: user.socialLinks.facebook || "",
					twitter: user.socialLinks.twitter || "",
					github: user.socialLinks.github || "",
					linkedin: user.socialLinks.linkedin || "",
					instagram: user.socialLinks.instagram || "",
					website: user.socialLinks.website || "",
				});
			}
			if (user.visibilitySettings) {
				const slVis = user.visibilitySettings.socialLinks;
				setVisibilitySettings({
					bio: user.visibilitySettings.bio ?? true,
					birthday: user.visibilitySettings.birthday ?? true,
					location: user.visibilitySettings.location ?? true,
					workplace: user.visibilitySettings.workplace ?? true,
					socialLinks: {
						facebook: slVis?.facebook ?? true,
						twitter: slVis?.twitter ?? true,
						github: slVis?.github ?? true,
						linkedin: slVis?.linkedin ?? true,
						instagram: slVis?.instagram ?? true,
						website: slVis?.website ?? true,
					},
				});
			}
			setAvatar(user.avatar);
			setCover(user.cover);
		}
	}, [user]);

	const handleSave = async () => {
		setError("");
		setSuccess("");
		setSaving(true);

		try {
			const filteredSocialLinks = Object.fromEntries(
				Object.entries(socialLinks).filter(([, v]) => v !== "")
			);
			const response = await profileService.updateProfile({
				avatar: avatar,
				cover: cover,
				birthday: birthday || null,
				location: location || null,
				workplace: workplace || null,
				bio: bio || null,
				socialLinks:
					Object.keys(filteredSocialLinks).length > 0
						? filteredSocialLinks
						: null,
				visibilitySettings,
			});

			setSuccess(response.message);
			await refreshUser();

			setTimeout(() => {
				router.push("/profile");
			}, 1000);
		} catch (err) {
			const apiError = err as {message?: string};
			setError(apiError.message || "Đã xảy ra lỗi khi cập nhật profile");
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		router.push("/profile");
	};

	const handleVisibilityChange = (
		field: keyof Omit<VisibilitySettings, "socialLinks">
	) => {
		setVisibilitySettings((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleSocialLinkVisibilityChange = (
		platform: keyof SocialLinksVisibility
	) => {
		setVisibilitySettings((prev) => ({
			...prev,
			socialLinks: {
				...prev.socialLinks,
				[platform]: !prev.socialLinks[platform],
			},
		}));
	};

	const handleAvatarUpload = (base64: string) => {
		setAvatar(base64);
	};

	if (authLoading) {
		return (
			<div className='min-h-screen bg-black text-white flex items-center justify-center'>
				<Loader2 className='w-8 h-8 animate-spin text-white/50' />
			</div>
		);
	}

	if (!user) {
		router.push("/signin");
		return null;
	}

	return (
		<>
			<div className='min-h-[calc(100vh-65px)] bg-black text-white pb-20'>
				<div className='relative h-[300px] md:h-[400px] w-full'>
					{cover ? (
						<img
							src={cover}
							alt='Cover'
							className='absolute inset-0 w-full h-full object-cover'
						/>
					) : (
						<div className='absolute inset-0 bg-gradient-to-br from-[#ff79c6]/30 via-[#bd93f9]/20 to-[#8be9fd]/30' />
					)}
					<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
					<button
						onClick={() => setCoverOverlayOpen(true)}
						className='absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-sm font-medium flex items-center gap-2 transition-all cursor-pointer'
					>
						<Camera className='w-4 h-4' />
						<span className='hidden sm:inline'>
							Chỉnh sửa ảnh bìa
						</span>
					</button>
				</div>

				<div className='max-w-5xl mx-auto px-4 -mt-20 relative z-10'>
					<div className='flex flex-col md:flex-row md:items-end gap-4'>
						<div className='relative'>
							<div className='w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-black bg-black overflow-hidden'>
								{avatar ? (
									<img
										src={avatar}
										alt='Avatar'
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='w-full h-full bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] flex items-center justify-center'>
										<span className='text-4xl font-bold text-white'>
											{user?.username
												?.charAt(0)
												?.toUpperCase() || "U"}
										</span>
									</div>
								)}
							</div>
							<button
								onClick={() => setAvatarOverlayOpen(true)}
								className='absolute bottom-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all cursor-pointer'
							>
								<Camera className='w-4 h-4 text-white' />
							</button>
						</div>

						<div className='flex-1' />
						<div className='flex gap-2 pb-4'>
							<Button
								onClick={handleCancel}
								className='bg-white/5 hover:bg-white/10 text-white border border-white/10'
							>
								<ArrowLeft className='w-4 h-4 mr-2' />
								Quay lại
							</Button>
						</div>
					</div>

					<div className='mt-6 border-t border-white/10 pt-6'>
						<div className='space-y-6'>
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white mb-4'>
									Thông tin cá nhân
								</h3>
								<div>
									<div className='flex items-center justify-between mb-2'>
										<label className='text-sm font-medium text-white/70 flex items-center'>
											<FileText className='w-4 h-4 mr-2' />
											Tiểu sử
										</label>
										<Toggle
											checked={visibilitySettings.bio}
											onChange={() =>
												handleVisibilityChange("bio")
											}
										/>
									</div>
									<textarea
										value={bio}
										onChange={(e) => setBio(e.target.value)}
										rows={4}
										maxLength={500}
										className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all resize-none'
										placeholder='Giới thiệu ngắn về bản thân...'
									/>
									<p className='text-white/30 text-xs mt-1 text-right'>
										{bio.length}/500
									</p>
								</div>
								<div>
									<div className='flex items-center justify-between mb-2'>
										<label className='text-sm font-medium text-white/70 flex items-center'>
											<Calendar className='w-4 h-4 mr-2' />
											Ngày sinh
										</label>
										<Toggle
											checked={
												visibilitySettings.birthday
											}
											onChange={() =>
												handleVisibilityChange(
													"birthday"
												)
											}
										/>
									</div>
									<DateInput
										value={birthday}
										onChange={(value) => setBirthday(value)}
										placeholder='Chọn ngày sinh'
									/>
								</div>

								<div>
									<div className='flex items-center justify-between mb-2'>
										<label className='text-sm font-medium text-white/70 flex items-center'>
											<MapPin className='w-4 h-4 mr-2' />
											Đến từ
										</label>
										<Toggle
											checked={
												visibilitySettings.location
											}
											onChange={() =>
												handleVisibilityChange(
													"location"
												)
											}
										/>
									</div>
									<input
										type='text'
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
										className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
										placeholder='TP. Hồ Chí Minh, Việt Nam'
									/>
								</div>

								<div>
									<div className='flex items-center justify-between mb-2'>
										<label className='text-sm font-medium text-white/70 flex items-center'>
											<Briefcase className='w-4 h-4 mr-2' />
											Làm việc tại
										</label>
										<Toggle
											checked={
												visibilitySettings.workplace
											}
											onChange={() =>
												handleVisibilityChange(
													"workplace"
												)
											}
										/>
									</div>
									<input
										type='text'
										value={workplace}
										onChange={(e) =>
											setWorkplace(e.target.value)
										}
										className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
										placeholder='Tên công ty'
									/>
								</div>
							</div>

							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-white'>
									Liên kết mạng xã hội
								</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Facebook className='w-4 h-4 mr-2' />
												Facebook
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.facebook
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"facebook"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.facebook}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													facebook: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://facebook.com/username'
										/>
									</div>

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Twitter className='w-4 h-4 mr-2' />
												Twitter
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.twitter
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"twitter"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.twitter}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													twitter: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://twitter.com/username'
										/>
									</div>

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Github className='w-4 h-4 mr-2' />
												GitHub
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.github
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"github"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.github}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													github: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://github.com/username'
										/>
									</div>

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Linkedin className='w-4 h-4 mr-2' />
												LinkedIn
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.linkedin
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"linkedin"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.linkedin}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													linkedin: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://linkedin.com/in/username'
										/>
									</div>

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Instagram className='w-4 h-4 mr-2' />
												Instagram
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.instagram
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"instagram"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.instagram}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													instagram: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://instagram.com/username'
										/>
									</div>

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='text-sm font-medium text-white/70 flex items-center'>
												<Globe className='w-4 h-4 mr-2' />
												Website
											</label>
											<Toggle
												checked={
													visibilitySettings
														.socialLinks.website
												}
												onChange={() =>
													handleSocialLinkVisibilityChange(
														"website"
													)
												}
											/>
										</div>
										<input
											type='url'
											value={socialLinks.website}
											onChange={(e) =>
												setSocialLinks({
													...socialLinks,
													website: e.target.value,
												})
											}
											className='w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6] transition-all'
											placeholder='https://yourwebsite.com'
										/>
									</div>
								</div>
							</div>

							<div className='flex gap-3'>
								<Button
									onClick={handleCancel}
									className='flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10'
								>
									Hủy
								</Button>
								<Button
									onClick={handleSave}
									disabled={saving}
									className='flex-1 bg-[#ff79c6] hover:bg-[#ff79c6]/90 text-white font-medium'
								>
									{saving ? (
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />
											Đang lưu...
										</>
									) : (
										<>
											<Save className='w-4 h-4 mr-2' />
											Lưu thay đổi
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AvatarUploadOverlay
				isOpen={avatarOverlayOpen}
				onClose={() => setAvatarOverlayOpen(false)}
				onUpload={handleAvatarUpload}
				currentAvatar={avatar}
			/>

			<CoverUploadOverlay
				isOpen={coverOverlayOpen}
				onClose={() => setCoverOverlayOpen(false)}
				onUpload={(base64) => setCover(base64)}
				currentCover={cover}
			/>
		</>
	);
}

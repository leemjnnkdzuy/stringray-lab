"use client";

import React from "react";
import {
	Home,
	Users,
	Bookmark,
	Bell,
	Plus,
	Search,
	Loader2,
	User,
	Settings,
	LogOut,
} from "lucide-react";
import {TextInput} from "@/app/components/ui/TextInput";
import {Button} from "@/app/components/ui/Button";
import {cn} from "@/app/utils/utils";
import {DropDown} from "@/app/components/ui/DropDown";
import {useRouter, usePathname} from "next/navigation";
import {useTheme} from "@/app/hooks/useTheme";
import {images} from "@/app/assets";
import Image from "next/image";
import {useAuthContext} from "@/app/context/AuthContext";

const NavIcon = ({
	icon: Icon,
	active = false,
	onClick,
}: {
	icon: typeof Home;
	active?: boolean;
	onClick?: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				"cursor-pointer px-6 transition-all duration-300 group relative flex items-center h-full",
				active
					? "text-[#ff79c6]"
					: "text-white/40 hover:text-[#ff79c6] hover:bg-white/5"
			)}
		>
			<Icon className='w-7 h-7' strokeWidth={active ? 2.5 : 2} />
			{active && (
				<span className='absolute bottom-0 left-0 w-full h-[3px] bg-[#ff79c6] shadow-[0_0_8px_#ff79c6]' />
			)}
		</div>
	);
};

export const HomeHeader = () => {
	const router = useRouter();
	const {theme} = useTheme();
	const {user, logout} = useAuthContext();

	const handleLogout = async () => {
		try {
			await logout();
			localStorage.removeItem("isLoggedIn");
			router.push("/sign-in");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-4 h-[65px]'>
			<div className='max-w-[1920px] mx-auto flex items-center justify-between h-full'>
				<div className='flex items-center gap-6 w-1/4'>
					<div
						className='flex items-center gap-2 cursor-pointer'
						onClick={() => router.push("/home")}
					>
						<Image
							src={
								theme === "dark"
									? images.logoWhite
									: images.logoBlack
							}
							alt='Stingray Logo'
							width={40}
							height={40}
							className='w-10 h-10 object-contain'
						/>
					</div>

					<div className='hidden md:block w-full max-w-[280px]'>
						<TextInput
							placeholder='Tìm kiếm trên Stingray...'
							icon={Search}
							className='bg-white/5 border-white/5 rounded-full !h-[40px] !py-0 flex items-center hover:bg-white/10 transition-colors'
							containerClassName='!space-y-0'
						/>
					</div>
				</div>

				<div className='hidden md:flex items-center justify-center gap-2 flex-1 h-full'>
					<div className='flex items-center gap-2 h-full'>
						<NavIcon
							icon={Home}
							active={pathname === "/home"}
							onClick={() => router.push("/home")}
						/>
						<NavIcon icon={Users} />
						<NavIcon icon={Bookmark} />
					</div>
				</div>

				<div className='flex items-center justify-end gap-3 w-1/4'>
					<Button
						onClick={() => router.push("/create-plot")}
						className={cn(
							"!rounded-full !px-5 !py-2 !text-sm !h-10 gap-2 bg-[#ff79c6]/10 text-[#ff79c6] border-[#ff79c6]/20 hover:bg-[#ff79c6]/20 hover:!scale-100 hidden sm:inline-flex transition-all duration-300",
							pathname === "/create-plot" &&
								"opacity-0 pointer-events-none -translate-x-5"
						)}
					>
						<Plus className='w-5 h-5' />
						<span>Tạo bản vẽ</span>
					</Button>

					<div className='w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer transition-colors group'>
						<Bell className='w-5 h-5 text-white/70 group-hover:text-white transition-colors' />
					</div>

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
							<div className='w-10 h-10 rounded-full cursor-pointer overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors'>
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt='User'
										className='w-full h-full object-cover'
									/>
								) : (
									<Loader2 className='w-5 h-5 text-white animate-spin' />
								)}
							</div>
						}
					/>
				</div>
			</div>
		</header>
	);
};

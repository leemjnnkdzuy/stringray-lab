"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/app/components/ui/Button";
import {LogOut, User, Mail, Loader2} from "lucide-react";
import {motion} from "framer-motion";
import {useAuthContext} from "@/app/context/AuthContext";

export default function HomePage() {
	const nav = useRouter();
	const {user, loading, logout} = useAuthContext();
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			await logout();
			localStorage.removeItem("isLoggedIn");
			nav.push("/sign-in");
		} catch {
			setLoggingOut(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-black text-white flex items-center justify-center'>
				<Loader2 className='w-8 h-8 animate-spin text-white/50' />
			</div>
		);
	}

	return (
		<div className='min-h-[calc(100vh-65px)] bg-black text-white relative overflow-hidden flex items-center justify-center p-4'>
			<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0d1117] to-black -z-20' />
			<div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff79c6]/10 rounded-full blur-[128px] pointer-events-none -z-10' />
			<div className='absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] pointer-events-none -z-10' />

			<motion.div
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				className='w-full max-w-md space-y-8 relative z-10'
			>
				<div className='text-center'>
					<h1 className='text-3xl font-bold tracking-tight text-white mb-2'>
						Xin chào, {user?.username}!
					</h1>
					<p className='text-white/50 text-sm'>
						Bạn đã đăng nhập thành công
					</p>
				</div>

				<div className='space-y-4 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md'>
					{user?.avatar && (
						<div className='flex justify-center'>
							<img
								src={user.avatar}
								alt='Avatar'
								className='w-24 h-24 rounded-full border-2 border-white/20'
							/>
						</div>
					)}

					<div className='flex items-center gap-3 p-3 rounded-lg bg-white/5'>
						<User className='w-5 h-5 text-white/50' />
						<div>
							<p className='text-xs text-white/40'>
								Tên đăng nhập
							</p>
							<p className='text-white'>{user?.username}</p>
						</div>
					</div>

					<div className='flex items-center gap-3 p-3 rounded-lg bg-white/5'>
						<Mail className='w-5 h-5 text-white/50' />
						<div>
							<p className='text-xs text-white/40'>Email</p>
							<p className='text-white'>{user?.email}</p>
						</div>
					</div>
				</div>

				<Button
					onClick={handleLogout}
					disabled={loggingOut}
					className='w-full bg-transparent border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-white/50 hover:text-red-400'
				>
					{loggingOut ? (
						<Loader2 className='w-5 h-5 mr-2 animate-spin' />
					) : (
						<LogOut className='w-5 h-5 mr-2' />
					)}
					Đăng xuất
				</Button>
			</motion.div>
		</div>
	);
}

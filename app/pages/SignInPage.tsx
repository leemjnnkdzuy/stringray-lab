"use client";

import {useState, useEffect, FormEvent} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/app/components/ui/Button";
import {TextInput} from "@/app/components/ui/TextInput";
import {
	Activity,
	ArrowLeft,
	Eye,
	EyeOff,
	Lock,
	Mail,
	Loader2,
} from "lucide-react";
import {authService} from "@/app/services/auth";
import {useGlobalNotificationPopup} from "@/app/hooks/useGlobalNotificationPopup";
import {motion} from "framer-motion";

export default function SignInPage() {
	const nav = useRouter();
	const {error: showError, success: showSuccess} =
		useGlobalNotificationPopup();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loggedIn = localStorage.getItem("isLoggedIn") === "true";
		if (loggedIn) {
			nav.push("/home");
		}
	}, [nav]);

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await authService.login({email, password, rememberMe});
			if (res.user) {
				localStorage.setItem("isLoggedIn", "true");
				nav.push("/home");
			} else {
				const errorMsg = res.message || "Đăng nhập thất bại";
				setError(errorMsg);
				showError(errorMsg, "Lỗi đăng nhập");
			}
		} catch (err) {
			const errorMsg = "Đã xảy ra lỗi kết nối";
			setError(errorMsg);
			showError(errorMsg, "Lỗi hệ thống");
		} finally {
			setLoading(false);
		}
	};

	const containerVariants = {
		hidden: {opacity: 0},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				staggerDirection: -1,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				staggerChildren: 0.1,
				staggerDirection: 1,
			},
		},
	};

	const itemVariants = {
		hidden: {x: 50, opacity: 0},
		visible: {x: 0, opacity: 1},
		exit: {x: -50, opacity: 0},
	};

	return (
		<div className='min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4'>
			<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0d1117] to-black -z-20' />
			<div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ff79c6]/10 rounded-full blur-[128px] pointer-events-none -z-10' />
			<div className='absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] pointer-events-none -z-10' />

			<div className='absolute top-8 left-8 z-20'>
				<Button
					onClick={() => nav.push("/")}
					className='bg-transparent border-white/10 hover:bg-white/5 text-white/50 hover:text-white px-3 py-1 text-sm min-w-[auto]'
				>
					<ArrowLeft className='w-4 h-4 mr-2' />
					Trở về trang chủ
				</Button>
			</div>

			<div className='w-full max-w-md space-y-8 relative z-10'>
				<motion.div
					initial={{opacity: 0, scale: 0.95}}
					animate={{opacity: 1, scale: 1}}
					className='text-center'
				>
					<h2 className='text-3xl font-bold tracking-tight text-white mb-2'>
						Đăng nhập
					</h2>
				</motion.div>

				<motion.form
					variants={containerVariants}
					initial='hidden'
					animate='visible'
					className='space-y-6'
					onSubmit={handleLogin}
				>
					<div className='space-y-4'>
						<motion.div variants={itemVariants}>
							<TextInput
								label='Email'
								icon={Mail}
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='name@example.com'
							/>
						</motion.div>

						<motion.div variants={itemVariants}>
							<TextInput
								label='Mật khẩu'
								icon={Lock}
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='••••••••'
								rightElement={
									<button
										type='button'
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className='flex items-center justify-center'
									>
										{showPassword ? (
											<EyeOff className='w-5 h-5' />
										) : (
											<Eye className='w-5 h-5' />
										)}
									</button>
								}
							/>
						</motion.div>
					</div>

					<motion.div
						variants={itemVariants}
						className='flex items-center justify-between text-sm'
					>
						<label className='flex items-center gap-2 cursor-pointer group'>
							<input
								type='checkbox'
								checked={rememberMe}
								onChange={(e) =>
									setRememberMe(e.target.checked)
								}
								className='w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#ff79c6] checked:border-[#ff79c6] focus:ring-offset-0 focus:ring-[#ff79c6] transition-all cursor-pointer'
							/>
							<span className='text-white/60 group-hover:text-white/80 transition-colors'>
								Ghi nhớ đăng nhập
							</span>
						</label>
						<button
							type='button'
							onClick={() => nav.push("/forgot-password")}
							className='cursor-pointer text-[#ff79c6] hover:text-[#ff92d0] transition-colors'
						>
							Quên mật khẩu?
						</button>
					</motion.div>

					<motion.div variants={itemVariants}>
						<Button
							type='submit'
							className='w-full bg-transparent border-white/10 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={loading}
						>
							{loading ? (
								<Loader2 className='w-5 h-5 mr-2 animate-spin' />
							) : (
								"Đăng nhập"
							)}
						</Button>
					</motion.div>

					<motion.div variants={itemVariants}>
						<p className='text-center text-sm text-white/40'>
							Chưa có tài khoản?{" "}
							<button
								type='button'
								onClick={() => nav.push("/sign-up")}
								className='cursor-pointer text-[#ff79c6] hover:text-[#ff92d0] transition-colors font-medium'
							>
								Đăng ký ngay
							</button>
						</p>
					</motion.div>
				</motion.form>
			</div>
		</div>
	);
}

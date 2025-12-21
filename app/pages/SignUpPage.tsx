"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/app/components/ui/Button";
import {TextInput} from "@/app/components/ui/TextInput";
import {
	Check,
	ArrowLeft,
	Eye,
	EyeOff,
	Lock,
	Mail,
	User,
	Loader2,
} from "lucide-react";
import {authService} from "@/app/services/auth";
import {useGlobalNotificationPopup} from "@/app/hooks/useGlobalNotificationPopup";
import {motion, AnimatePresence} from "framer-motion";

export default function SignUpPage() {
	const nav = useRouter();
	const {error: showError, success: showSuccess} =
		useGlobalNotificationPopup();
	const [step, setStep] = useState(1);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otp, setOtp] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);

	useEffect(() => {
		const loggedIn = localStorage.getItem("isLoggedIn") === "true";
		if (loggedIn) {
			nav.push("/home");
		}
	}, [nav]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (step === 2 && countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [step, countdown]);

	const handleResendOtp = async () => {
		setCountdown(60);
		await handleRegister();
	};

	const handleRegister = async () => {
		const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
		if (!usernameRegex.test(username)) {
			const errorMsg =
				"Tên đăng nhập phải có ít nhất 3 ký tự và chỉ chứa chữ cái hoặc số";
			setError(errorMsg);
			showError(errorMsg, "Lỗi đăng ký");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			const errorMsg = "Địa chỉ email không hợp lệ";
			setError(errorMsg);
			showError(errorMsg, "Lỗi đăng ký");
			return;
		}

		if (password.length < 6) {
			const errorMsg = "Mật khẩu phải có ít nhất 6 ký tự";
			setError(errorMsg);
			showError(errorMsg, "Lỗi đăng ký");
			return;
		}

		if (password !== confirmPassword) {
			const errorMsg = "Mật khẩu nhập lại không khớp";
			setError(errorMsg);
			showError(errorMsg, "Lỗi đăng ký");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const res = await authService.register({username, email, password});
			if (res.email || res.message?.includes("OTP")) {
				setStep(2);
			} else {
				const errorMsg = res.message || "Đăng ký thất bại";
				setError(errorMsg);
				showError(errorMsg, "Lỗi đăng ký");
			}
		} catch (err) {
			const errorMsg = "Đã xảy ra lỗi kết nối";
			setError(errorMsg);
			showError(errorMsg, "Lỗi hệ thống");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async () => {
		setError("");
		setLoading(true);

		try {
			const res = await authService.verifyOtp(email, otp);
			if (res.message === "Xác thực tài khoản thành công") {
				setStep(3);
			} else {
				const errorMsg = res.message || "Xác thực thất bại";
				setError(errorMsg);
				showError(errorMsg, "Lỗi xác thực");
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
				<div className='text-center'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={step}
							initial={{opacity: 0, scale: 0.95}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.95}}
							transition={{duration: 0.3}}
						>
							<h2 className='text-3xl font-bold tracking-tight text-white mb-2'>
								{step === 1 && "Đăng ký"}
								{step === 2 && "Xác thực OTP"}
								{step === 3 && "Thành công!"}
							</h2>
							{step === 2 && (
								<p className='text-white/50 text-sm'>
									Mã OTP đã được gửi đến {email}
								</p>
							)}
						</motion.div>
					</AnimatePresence>
				</div>

				<div className='space-y-6'>
					<AnimatePresence mode='wait'>
						{step === 1 && (
							<motion.div
								key='step1'
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								className='space-y-4'
							>
								<motion.div variants={itemVariants}>
									<TextInput
										label='Tên đăng nhập'
										icon={User}
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
										placeholder='username'
									/>
								</motion.div>

								<motion.div variants={itemVariants}>
									<TextInput
										label='Email'
										icon={Mail}
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder='name@example.com'
									/>
								</motion.div>

								<motion.div variants={itemVariants}>
									<TextInput
										label='Mật khẩu'
										icon={Lock}
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										placeholder='••••••••'
										rightElement={
											<button
												type='button'
												onClick={() =>
													setShowPassword(
														!showPassword
													)
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

								<motion.div variants={itemVariants}>
									<TextInput
										label='Nhập lại mật khẩu'
										icon={Lock}
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										placeholder='••••••••'
										rightElement={
											<button
												type='button'
												onClick={() =>
													setShowConfirmPassword(
														!showConfirmPassword
													)
												}
												className='flex items-center justify-center'
											>
												{showConfirmPassword ? (
													<EyeOff className='w-5 h-5' />
												) : (
													<Eye className='w-5 h-5' />
												)}
											</button>
										}
									/>
								</motion.div>

								<motion.div variants={itemVariants}>
									<Button
										className='w-full bg-transparent border-white/10 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-50'
										onClick={handleRegister}
										disabled={loading}
									>
										{loading ? (
											<Loader2 className='w-5 h-5 mr-2 animate-spin' />
										) : (
											"Tiếp tục"
										)}
									</Button>
								</motion.div>

								<motion.div variants={itemVariants}>
									<p className='text-center text-sm text-white/40'>
										Đã có tài khoản?{" "}
										<button
											onClick={() => nav.push("/sign-in")}
											className='text-[#ff79c6] hover:text-[#ff92d0] transition-colors font-medium cursor-pointer'
										>
											Đăng nhập ngay
										</button>
									</p>
								</motion.div>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key='step2'
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								className='space-y-4'
							>
								<motion.div variants={itemVariants}>
									<TextInput
										label='Mã OTP'
										icon={Lock}
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										placeholder='Nhập mã 6 số'
										className='text-center tracking-widest text-lg'
										maxLength={6}
										rightElement={
											<button
												type='button'
												onClick={handleResendOtp}
												disabled={
													countdown > 0 || loading
												}
												className='text-xs text-white/50 hover:text-white disabled:hover:text-white/50 transition-colors flex items-center justify-center min-w-[60px] cursor-pointer disabled:cursor-not-allowed'
											>
												{countdown > 0
													? `${countdown}s`
													: "Gửi lại"}
											</button>
										}
									/>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Button
										className='w-full bg-transparent border-white/10 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-50'
										onClick={handleVerifyOtp}
										disabled={loading}
									>
										{loading ? (
											<Loader2 className='w-5 h-5 mr-2 animate-spin' />
										) : (
											"Xác nhận"
										)}
									</Button>
								</motion.div>
								<motion.div variants={itemVariants}>
									<button
										onClick={() => setStep(1)}
										className='w-full text-center text-sm text-white/40 hover:text-white transition-colors'
									>
										Quay lại
									</button>
								</motion.div>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								key='step3'
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								className='space-y-6 text-center'
							>
								<motion.div variants={itemVariants}>
									<div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto'>
										<Check className='w-8 h-8 text-green-500' />
									</div>
								</motion.div>
								<motion.div variants={itemVariants}>
									<p className='text-white/70'>
										Tài khoản của bạn đã được tạo và xác
										thực thành công.
									</p>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Button
										className='w-full bg-transparent border-white/10 hover:bg-white/5 text-white/50 hover:text-white'
										onClick={() => nav.push("/sign-in")}
									>
										Về trang đăng nhập
									</Button>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

"use client";

import {Button} from "@/app/components/ui/Button";
import {ArrowLeft, Home} from "lucide-react";

export default function NotFoundPage() {
	return (
		<div className='min-h-screen bg-black relative overflow-hidden flex items-center justify-center'>
			<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0d1117] to-black -z-20' />
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none -z-10' />

			<div className='text-center space-y-8 px-4'>
				<div className='space-y-4'>
					<h1 className='text-8xl sm:text-9xl font-bold text-[#ff79c6]'>
						404
					</h1>
					<h2 className='text-2xl sm:text-3xl font-bold text-white'>
						Oops! Trang không tồn tại
					</h2>
					<p className='text-white/60 max-w-md mx-auto'>
						Có vẻ như bạn đã lạc vào một vùng đất chưa được khám
						phá. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
						chuyển.
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
					<Button
						className='min-w-[160px] px-6 py-3 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
						onClick={() => window.history.back()}
					>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Quay lại
					</Button>
					<Button
						className='min-w-[160px] px-6 py-3 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
						onClick={() => (window.location.href = "/")}
					>
						<Home className='w-4 h-4 mr-2' />
						Về trang chủ
					</Button>
				</div>
			</div>
		</div>
	);
}

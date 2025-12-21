"use client";

import {useRouter} from "next/navigation";
import Image from "next/image";
import {images} from "@/app/assets";
import {ArrowLeft, Facebook, Github, Instagram} from "lucide-react";

const TikTokIcon = ({className}: {className?: string}) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
	>
		<path d='M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5' />
	</svg>
);

export default function AboutUs() {
	const nav = useRouter();

	const socialLinks = [
		{
			icon: Facebook,
			href: "https://www.facebook.com/leemjnnkdzuy",
			color: "hover:text-blue-500",
		},
		{
			icon: TikTokIcon,
			href: "https://www.tiktok.com/@leemjnnkdzuy",
			color: "hover:text-[#ff0050]",
		},
		{
			icon: Instagram,
			href: "https://www.instagram.com/leemjnnkdzuy",
			color: "hover:text-pink-500",
		},
		{
			icon: Github,
			href: "https://github.com/leemjnnkdzuy",
			color: "hover:text-white",
		},
	];

	return (
		<div className='min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center py-20 px-8'>
			<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0d1117] to-black -z-20' />
			<div className='absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#ff79c6]/10 rounded-full blur-[128px] pointer-events-none -z-10' />
			<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] pointer-events-none -z-10' />

			<div className='max-w-6xl mx-auto w-full'>
				<button
					onClick={() => nav.push("/")}
					className='cursor-pointer p-2 rounded-full text-white/50 hover:text-white transition-colors flex items-center gap-2 group mb-8'
				>
					<ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
					<span className='font-medium'>Trở về trang chủ</span>
				</button>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					<div className='space-y-8'>
						<div className='space-y-4'>
							<h1 className='text-4xl sm:text-6xl font-bold tracking-tight'>
								Hello gei, <br />
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50'>
									Mình là Duy
								</span>{" "}
								<span className='text-[#ff79c6] text-2xl sm:text-4xl block mt-2'>
									(leemjnnkdzuy)
								</span>
							</h1>
						</div>

						<p className='text-lg text-white/60 leading-relaxed font-light'>
							Đây là project mình tình cờ có ý tưởng khi lướt
							tiktok trong thời gian đang nằm nhà thất nghiệp sau
							khi mới thi giải cho trường về =))) anyway thì trung
							bình người miền tây thfi sau giờ cơm sẽ là 1 phích
							trà đường và cái võng kèm theo cái điện thoại mở
							tiktok, mình tình cờ lướt trúng 1 clip trong khá hay
							các hình dạng khá đẹp được tạo từ những dấu chấm và
							được điều kiển bởi nhưng dòng code. Và boom trang
							web này ra đời.
						</p>

						<div className='flex items-center gap-4'>
							{socialLinks.map((link, index) => (
								<div
									key={index}
									onClick={() =>
										window.open(link.href, "_blank")
									}
									className={`p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer transition-all hover:scale-110 hover:bg-white/10 ${link.color}`}
								>
									<link.icon className='w-6 h-6' />
								</div>
							))}
						</div>
					</div>

					<div className='relative lg:h-[600px] flex items-center justify-center lg:justify-end'>
						<div className='relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px]'>
							<div className='absolute inset-0 border-2 border-white/10 rounded-full scale-110 animate-pulse' />
							<div className='absolute inset-0 border border-[#ff79c6]/20 rounded-full scale-125 opacity-50' />

							<div className='w-full h-full rounded-full overflow-hidden border-4 border-white/10 relative z-10 bg-[#1a1b26] flex items-center justify-center'>
								<Image
									src={images.leemjnnkdzuy}
									alt='Duy (leemjnnkdzuy)'
									fill
									className='object-cover transition-transform duration-700'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import {useEffect, useState, useRef} from "react";
import {Activity, Sparkles, Sigma, Code, Heart, ArrowRight} from "lucide-react";
import MathVisualization from "@/app/components/common/MathVisualization";
import {Button} from "@/app/components/ui/Button";
import {Card} from "@/app/components/ui/Card";
import {useAuth} from "@/app/hooks/useAuth";
import {useRouter} from "next/navigation";

const matlabCode = `figure('Position',[300,50,900,900], 'Color','k');
axes(gcf, 'NextPlot','add', 'Position',[0,0,1,1], 'Color','k');
axis([0, 400, 0, 400]); axis off;

num_points = 1e4;
SHdl = scatter([], [], 2, 'filled','o','w', ...
    'MarkerEdgeColor','none', 'MarkerFaceAlpha',0.6);
t = 0;
i = 1:num_points;

r_base = sqrt(i) * 1.5;
theta_base = i * (137.5 * pi / 180);

while true
    t = t + 0.02;
    
    r = r_base + 10 .* sin(r_base./20 - t*3);
    theta = theta_base + t/2 + 5./r_base .* sin(t);
    
    x = r .* cos(theta) + 200;
    y = r .* sin(theta) + 200;
    
    SHdl.XData = x;
    SHdl.YData = y;
    SHdl.CData = sin(i'/1000 + t) * 0.5 + 0.5;
    
    drawnow;
end`;

export default function LandingPage() {
	const {user} = useAuth();
	const router = useRouter();
	const [scrollProgress, setScrollProgress] = useState(0);
	const [cardsVisible, setCardsVisible] = useState(false);
	const [ctaVisible, setCtaVisible] = useState(false);
	const cardsRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);
	const targetProgress = useRef(0);
	const currentProgress = useRef(0);
	const rafId = useRef<number>(0);

	useEffect(() => {
		const lerp = (start: number, end: number, factor: number) => {
			return start + (end - start) * factor;
		};

		const updateProgress = () => {
			currentProgress.current = lerp(
				currentProgress.current,
				targetProgress.current,
				0.08
			);

			if (
				Math.abs(currentProgress.current - targetProgress.current) >
				0.0001
			) {
				setScrollProgress(currentProgress.current);
			} else {
				currentProgress.current = targetProgress.current;
				setScrollProgress(targetProgress.current);
			}

			rafId.current = requestAnimationFrame(updateProgress);
		};

		const handleScroll = () => {
			const scrollY = window.scrollY;
			targetProgress.current = Math.min(scrollY / window.innerHeight, 1);
		};

		window.addEventListener("scroll", handleScroll, {passive: true});
		rafId.current = requestAnimationFrame(updateProgress);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			cancelAnimationFrame(rafId.current);
		};
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setCardsVisible(true);
					}
				});
			},
			{threshold: 0.2}
		);

		if (cardsRef.current) {
			observer.observe(cardsRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setCtaVisible(true);
					}
				});
			},
			{threshold: 0.2}
		);

		if (ctaRef.current) {
			observer.observe(ctaRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div className='relative'>
			<div className='fixed top-6 left-8 z-50 flex items-center gap-2 group cursor-pointer'>
				<div className='w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center transition-all group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-12'>
					<Activity className='w-6 h-6 text-white' />
				</div>
				<span className='text-white font-bold text-xl tracking-wider drop-shadow-md transition-all group-hover:text-[#50fa7b]'>
					STINGRAY<span className='text-[#ff79c6]'>LAB</span>
				</span>
			</div>

			{user ? (
				<button
					style={{
						opacity: Math.max(0, 1 - scrollProgress * 4),
					}}
					className='fixed top-7 right-8 z-50 w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden hover:border-white/50 transition-all will-change-[opacity] focus:outline-none'
					onClick={() => router.push("/home")}
				>
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.username}
							className='w-full h-full object-cover'
						/>
					) : (
						<div className='w-full h-full bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] flex items-center justify-center text-xs font-bold text-white'>
							{user.username.substring(0, 2).toUpperCase()}
						</div>
					)}
				</button>
			) : (
				<Button
					style={{
						opacity: Math.max(0, 1 - scrollProgress * 4),
					}}
					className='fixed top-7 right-8 z-50 px-4 py-1.5 text-sm bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/40 will-change-[opacity]'
					onClick={() => router.push("/sign-in")}
				>
					Đăng nhập
				</Button>
			)}
			<div className='h-[202vh]'>
				<section className='h-screen w-full sticky top-0 overflow-hidden bg-black'>
					<div
						style={{
							width: `${100 - scrollProgress * 50}%`,
						}}
						className='absolute left-0 top-0 h-full will-change-[width]'
					>
						<MathVisualization />
					</div>

					<div
						style={{
							width: `${100 - scrollProgress * 50}%`,
						}}
						className='absolute left-0 top-0 h-full flex flex-col items-center justify-center z-10 will-change-[width]'
					>
						<div className='text-center space-y-6 max-w-xl px-4'>
							<h1
								style={{
									opacity: Math.max(
										0,
										1 - scrollProgress * 4
									),
								}}
								className='text-3xl font-bold tracking-tight sm:text-5xl text-white drop-shadow-lg will-change-[opacity]'
							>
								Bạn đang tìm kiếm điều gì đó thú vị?
							</h1>
							<p
								style={{
									opacity: Math.max(
										0,
										1 - (scrollProgress - 0.1) * 4
									),
								}}
								className='text-lg text-white/80 sm:text-xl will-change-[opacity]'
							>
								Stingray Lab chào mừng bạn
							</p>
							<Button
								onClick={() => {
									window.scrollTo({
										top: window.innerHeight,
										behavior: "smooth",
									});
								}}
								style={{
									opacity: Math.max(
										0,
										1 - (scrollProgress - 0.2) * 4
									),
								}}
							>
								Khám phá
							</Button>
						</div>
					</div>

					<div
						style={{
							width: `${scrollProgress * 50}%`,
							opacity: scrollProgress,
						}}
						className='absolute right-0 top-0 h-full z-10 overflow-hidden bg-transparent will-change-[width,opacity]'
					>
						<div className='w-[50vw] h-full flex items-center justify-center'>
							<div className='w-full max-w-2xl px-6'>
								<div className='rounded-lg overflow-hidden border border-[#44475a] bg-[#282a36] shadow-2xl'>
									<div className='px-4 py-3 flex items-center gap-2 border-b border-[#44475a] bg-[#282a36]'>
										<div className='flex gap-2'>
											<div className='w-3 h-3 rounded-full bg-[#ff5555]' />
											<div className='w-3 h-3 rounded-full bg-[#f1fa8c]' />
											<div className='w-3 h-3 rounded-full bg-[#50fa7b]' />
										</div>
										<span className='text-[#6272a4] text-sm ml-4 font-mono'>
											spiral_animation.m
										</span>
									</div>
									<pre className='p-4 overflow-auto text-xs font-mono leading-relaxed max-h-[70vh] bg-[#282a36]'>
										<code>
											{matlabCode
												.split("\n")
												.map((line, i) => (
													<div
														key={i}
														className='flex'
													>
														<span className='text-[#6272a4] w-6 text-right mr-3 select-none shrink-0'>
															{i + 1}
														</span>
														<span className='text-[#f8f8f2] whitespace-pre'>
															{highlightMatlabSyntax(
																line
															)}
														</span>
													</div>
												))}
										</code>
									</pre>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			{/* Purpose Section */}
			<section className='min-h-screen bg-black py-24 px-8 relative overflow-hidden flex items-center'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-[#0d1117] to-black -z-20' />
				<div className='absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[128px] pointer-events-none -z-10' />
				<div className='absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[128px] pointer-events-none -z-10' />

				<div className='max-w-7xl mx-auto w-full relative z-10'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
						<div className='text-left space-y-8'>
							<div>
								<h2 className='text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight leading-tight'>
									Stringray Lab
									<br />
									<span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50'>
										làm gì?
									</span>
								</h2>
								<p className='text-2xl text-neutral-400 font-medium'>
									Biến những con số thành nghệ thuật
								</p>
							</div>

							<p className='text-xl text-white/60 leading-relaxed max-w-xl font-light'>
								"Stingray Lab biến những{" "}
								<span className='text-white font-medium'>
									dòng code khô khan
								</span>
								, những công thức toán học phức tạp thành những{" "}
								<span className='text-[#ff79c6] font-medium'>
									tác phẩm sống động
								</span>
								. Chúng tôi tin rằng đằng sau mỗi phương trình
								là một câu chuyện đẹp đang chờ được đánh thức."
							</p>
						</div>

						<div ref={cardsRef} className='flex flex-col gap-6'>
							<Card
								hoverEffect
								className={`p-6 flex items-center gap-6 group border-l-4 border-l-neutral-500 bg-gradient-to-r from-white/5 to-transparent transition-all duration-700 ${
									cardsVisible
										? "opacity-100 translate-x-0"
										: "opacity-0 translate-x-20"
								}`}
							>
								<div className='w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors'>
									<Sigma className='w-7 h-7 text-white/60 group-hover:text-white transition-colors' />
								</div>
								<div>
									<h3 className='text-xl font-bold text-white mb-1 flex items-center gap-2'>
										Công thức{" "}
										<ArrowRight className='w-5 h-5' /> Hình
										ảnh
									</h3>
									<p className='text-white/50 text-sm'>
										Biến phương trình khô khan thành visual
										nghệ thuật.
									</p>
								</div>
							</Card>

							<Card
								hoverEffect
								className={`p-6 flex items-center gap-6 group border-l-4 border-l-neutral-500 bg-gradient-to-r from-white/5 to-transparent ml-8 transition-all duration-700 delay-150 ${
									cardsVisible
										? "opacity-100 translate-x-0"
										: "opacity-0 translate-x-20"
								}`}
							>
								<div className='w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors'>
									<Code className='w-7 h-7 text-white/60 group-hover:text-white transition-colors' />
								</div>
								<div>
									<h3 className='text-xl font-bold text-white mb-1 flex items-center gap-2'>
										Code <ArrowRight className='w-5 h-5' />{" "}
										Animation
									</h3>
									<p className='text-white/50 text-sm'>
										Mã lệnh trở thành chuyển động mượt mà.
									</p>
								</div>
							</Card>

							<Card
								hoverEffect
								className={`p-6 flex items-center gap-6 group border-l-4 border-l-neutral-500 bg-gradient-to-r from-white/5 to-transparent ml-16 transition-all duration-700 delay-300 ${
									cardsVisible
										? "opacity-100 translate-x-0"
										: "opacity-0 translate-x-20"
								}`}
							>
								<div className='w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-colors'>
									<Heart className='w-7 h-7 text-white/60 group-hover:text-white transition-colors' />
								</div>
								<div>
									<h3 className='text-xl font-bold text-white mb-1 flex items-center gap-2'>
										Dữ liệu{" "}
										<ArrowRight className='w-5 h-5' /> Nghệ
										thuật
									</h3>
									<p className='text-white/50 text-sm'>
										Số liệu vô hồn hóa tác phẩm có chiều
										sâu.
									</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section>
			{/* CTA Section */}
			<section className='min-h-screen bg-black py-24 px-8 relative overflow-hidden flex items-center justify-center'>
				<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-[#0d1117] to-black -z-20' />
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none -z-10' />

				<div
					ref={ctaRef}
					className='max-w-4xl mx-auto w-full text-center space-y-12'
				>
					<div
						className={`space-y-6 transition-all duration-700 ${
							ctaVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
					>
						<h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight'>
							Tham gia cùng bọn mình để <br />
							<span className='text-[#ff79c6]'>
								khám phá nhiều thứ hay ho hơn!
							</span>
						</h2>
					</div>

					<div
						className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-100 ${
							ctaVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
					>
						{user ? (
							<Button
								className='min-w-[180px] px-8 py-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
								onClick={() => router.push("/home")}
							>
								Trang chủ
							</Button>
						) : (
							<>
								<Button
									className='min-w-[180px] px-8 py-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
									onClick={() => router.push("/sign-in")}
								>
									Đăng nhập
								</Button>
								<Button
									className='min-w-[180px] px-8 py-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40'
									onClick={() => router.push("/sign-up")}
								>
									Đăng ký ngay
								</Button>
							</>
						)}
					</div>

					<div
						className={`pt-8 flex justify-center gap-8 text-white/40 text-sm transition-all duration-700 delay-200 ${
							ctaVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
					>
						<span className='flex items-center gap-2'>
							<div className='w-2 h-2 rounded-full bg-white/60' />
							Miễn phí
						</span>
						<span className='flex items-center gap-2'>
							<div className='w-2 h-2 rounded-full bg-white/60' />
							Dễ sử dụng
						</span>
						<span className='flex items-center gap-2'>
							<div className='w-2 h-2 rounded-full bg-[#ff79c6]' />
							Cộng đồng lớn
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}

function highlightMatlabSyntax(line: string): React.ReactNode {
	const patterns: {regex: RegExp; className: string}[] = [
		{regex: /%.*$/, className: "text-[#6272a4]"},
		{regex: /'[^']*'/g, className: "text-[#f1fa8c]"},
		{
			regex: /\b(figure|axes|axis|scatter|sin|cos|sqrt|pi|drawnow|while|true|end|off)\b/g,
			className: "text-[#ff79c6]",
		},
		{
			regex: /\b(gcf|SHdl|t|i|r|x|y|r_base|theta_base|theta|num_points)\b/g,
			className: "text-[#8be9fd]",
		},
		{regex: /\b(\d+\.?\d*e?\d*)\b/g, className: "text-[#bd93f9]"},
		{regex: /[+\-*/=<>~.;,:\[\](){}]/g, className: "text-[#ff79c6]"},
	];

	if (!line.trim()) return " ";

	const commentMatch = line.match(/%.*$/);
	if (commentMatch) {
		const beforeComment = line.slice(0, commentMatch.index);
		return (
			<>
				{highlightMatlabSyntax(beforeComment)}
				<span className='text-[#6272a4]'>{commentMatch[0]}</span>
			</>
		);
	}

	const stringMatches: {start: number; end: number; text: string}[] = [];
	const stringRegex = /'[^']*'/g;
	let match;
	while ((match = stringRegex.exec(line)) !== null) {
		stringMatches.push({
			start: match.index,
			end: match.index + match[0].length,
			text: match[0],
		});
	}

	if (stringMatches.length > 0) {
		const parts: React.ReactNode[] = [];
		let lastEnd = 0;
		stringMatches.forEach((m, idx) => {
			if (m.start > lastEnd) {
				parts.push(
					<span key={`pre-${idx}`}>
						{highlightNonString(line.slice(lastEnd, m.start))}
					</span>
				);
			}
			parts.push(
				<span key={`str-${idx}`} className='text-[#f1fa8c]'>
					{m.text}
				</span>
			);
			lastEnd = m.end;
		});
		if (lastEnd < line.length) {
			parts.push(
				<span key='post'>
					{highlightNonString(line.slice(lastEnd))}
				</span>
			);
		}
		return <>{parts}</>;
	}

	return highlightNonString(line);
}

function highlightNonString(text: string): React.ReactNode {
	const keywords =
		/\b(figure|axes|axis|scatter|sin|cos|sqrt|pi|drawnow|while|true|end|off)\b/;
	const variables =
		/\b(gcf|SHdl|t|i|r|x|y|r_base|theta_base|theta|num_points|XData|YData|CData|Position|Color|NextPlot|MarkerEdgeColor|MarkerFaceAlpha)\b/;
	const numbers = /\b(\d+\.?\d*e?\d*)\b/;

	const parts = text.split(/(\s+)/);

	return parts.map((part, idx) => {
		if (keywords.test(part)) {
			return (
				<span key={idx} className='text-[#ff79c6]'>
					{part}
				</span>
			);
		}
		if (variables.test(part)) {
			return (
				<span key={idx} className='text-[#8be9fd]'>
					{part}
				</span>
			);
		}
		if (numbers.test(part)) {
			return (
				<span key={idx} className='text-[#bd93f9]'>
					{part}
				</span>
			);
		}
		return <span key={idx}>{part}</span>;
	});
}

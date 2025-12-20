"use client";

import {useEffect, useRef} from "react";

interface MathVisualizationProps {
	style?: React.CSSProperties;
	className?: string;
}

export default function MathVisualization({
	style,
	className,
}: MathVisualizationProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d", {alpha: false});
		if (!ctx) return;

		const numPoints = 10000;
		const backgroundColor = "black";

		const rBaseArr = new Float32Array(numPoints);
		const thetaBaseArr = new Float32Array(numPoints);
		const indicesArr = new Float32Array(numPoints);

		for (let j = 0; j < numPoints; j++) {
			const i = j + 1;
			indicesArr[j] = i;
			rBaseArr[j] = Math.sqrt(i) * 1.5;
			thetaBaseArr[j] = i * ((137.5 * Math.PI) / 180);
		}

		let t = 0;
		let animationFrameId: number;

		const render = () => {
			const rect = container.getBoundingClientRect();
			const containerWidth = rect.width;
			const containerHeight = rect.height;

			if (
				canvas.width !== containerWidth ||
				canvas.height !== containerHeight
			) {
				canvas.width = containerWidth;
				canvas.height = containerHeight;
			}

			const width = canvas.width;
			const height = canvas.height;

			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, width, height);

			const logicalSize = 400;
			const scale = Math.min(width, height) / logicalSize;
			const offsetX = (width - logicalSize * scale) / 2;
			const offsetY = (height - logicalSize * scale) / 2;

			t += 0.005;

			ctx.fillStyle = "white";

			for (let j = 0; j < numPoints; j++) {
				const rBase = rBaseArr[j];
				const thetaBase = thetaBaseArr[j];
				const i = indicesArr[j];

				const r = rBase + 10 * Math.sin(rBase / 20.0 - t * 3.0);
				const theta = thetaBase + t / 2.0 + (5.0 / rBase) * Math.sin(t);

				const x = r * Math.cos(theta) + 200;
				const y = r * Math.sin(theta) + 200;

				const screenX = x * scale + offsetX;
				const screenY = (logicalSize - y) * scale + offsetY;

				const alpha = Math.sin(i / 1000.0 + t) * 0.5 + 0.5;

				ctx.globalAlpha = alpha;

				const size = Math.max(1.5, 2 * scale * 0.5);
				ctx.fillRect(
					screenX - size / 2,
					screenY - size / 2,
					size,
					size
				);
			}

			ctx.globalAlpha = 1.0;
			animationFrameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: "transparent",
				overflow: "hidden",
				...style,
			}}
			className={className}
		>
			<canvas
				ref={canvasRef}
				style={{
					display: "block",
					width: "100%",
					height: "100%",
					backgroundColor: "transparent",
				}}
			/>
		</div>
	);
}

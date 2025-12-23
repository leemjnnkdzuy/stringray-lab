"use client";

import React, {useRef, useEffect, useCallback, useState} from "react";
import {MatlabRenderer} from "@/app/utils/matlab/matlabRenderer";

interface MatlabCanvasProps {
	code: string;
	isRunning: boolean;
	onStop?: () => void;
}

export default function MatlabCanvas({code, isRunning}: MatlabCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rendererRef = useRef<MatlabRenderer | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [canvasReady, setCanvasReady] = useState(false);

	const updateCanvasSize = useCallback(() => {
		if (canvasRef.current && containerRef.current) {
			const container = containerRef.current;
			const size = Math.min(
				Math.max(container.clientWidth - 32, 400),
				Math.max(container.clientHeight - 32, 400)
			);
			canvasRef.current.width = size;
			canvasRef.current.height = size;
			setCanvasReady(true);
			return true;
		}
		return false;
	}, []);

	const initializeRenderer = useCallback(() => {
		if (canvasRef.current) {
			if (rendererRef.current) {
				rendererRef.current.stop();
			}
			rendererRef.current = new MatlabRenderer(canvasRef.current);
		}
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (updateCanvasSize()) {
				initializeRenderer();
			}
		}, 100);

		return () => {
			clearTimeout(timer);
			if (rendererRef.current) {
				rendererRef.current.stop();
			}
		};
	}, [updateCanvasSize, initializeRenderer]);

	useEffect(() => {
		if (!isRunning || !code.trim() || !canvasReady) {
			if (rendererRef.current) {
				rendererRef.current.stop();
			}
			return;
		}

		if (!rendererRef.current && canvasRef.current) {
			initializeRenderer();
		}

		if (rendererRef.current) {
			rendererRef.current.execute(code);
		}
	}, [code, isRunning, canvasReady, initializeRenderer]);

	useEffect(() => {
		const handleResize = () => {
			updateCanvasSize();
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [updateCanvasSize]);

	return (
		<div
			ref={containerRef}
			className='w-full h-full flex items-center justify-center p-4'
		>
			<canvas
				ref={canvasRef}
				width={500}
				height={500}
				className='rounded-lg shadow-2xl'
				style={{
					backgroundColor: "#000",
					maxWidth: "100%",
					maxHeight: "100%",
				}}
			/>
		</div>
	);
}

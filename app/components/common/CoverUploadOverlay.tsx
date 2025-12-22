"use client";

import React, {useState, useRef, useCallback} from "react";
import {
	Upload,
	X,
	Loader2,
	ZoomIn,
	ZoomOut,
	RotateCw,
	FlipHorizontal,
} from "lucide-react";
import {Button} from "@/app/components/ui/Button";
import {Overlay} from "@/app/components/ui/Overlay";
import {RangeInput} from "@/app/components/ui/RangeInput";
import Cropper from "react-easy-crop";

interface CoverUploadOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	onUpload: (base64: string) => void;
	currentCover?: string;
}

interface CroppedAreaPixels {
	x: number;
	y: number;
	width: number;
	height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

async function getCroppedImg(
	imageSrc: string,
	pixelCrop: CroppedAreaPixels,
	flip = {horizontal: false, vertical: false}
): Promise<string> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("No 2d context");
	}

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
	ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
	ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height
	);

	return canvas.toDataURL("image/jpeg", 0.9);
}

export const CoverUploadOverlay = ({
	isOpen,
	onClose,
	onUpload,
	currentCover,
}: CoverUploadOverlayProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [crop, setCrop] = useState({x: 0, y: 0});
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [flip, setFlip] = useState({horizontal: false, vertical: false});
	const [croppedAreaPixels, setCroppedAreaPixels] =
		useState<CroppedAreaPixels | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const processFile = useCallback((file: File) => {
		if (!file.type.startsWith("image/")) {
			return;
		}

		setLoading(true);
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			setImageSrc(result);
			setCrop({x: 0, y: 0});
			setZoom(1);
			setRotation(0);
			setFlip({horizontal: false, vertical: false});
			setLoading(false);
		};
		reader.readAsDataURL(file);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const file = e.dataTransfer.files[0];
			if (file) {
				processFile(file);
			}
		},
		[processFile]
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				processFile(file);
			}
		},
		[processFile]
	);

	const onCropComplete = useCallback(
		(croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const handleConfirm = useCallback(async () => {
		if (imageSrc && croppedAreaPixels) {
			setLoading(true);
			try {
				const croppedImage = await getCroppedImg(
					imageSrc,
					croppedAreaPixels,
					flip
				);
				onUpload(croppedImage);
				setImageSrc(null);
				onClose();
			} catch (error) {
				console.error("Error cropping image:", error);
			} finally {
				setLoading(false);
			}
		}
	}, [imageSrc, croppedAreaPixels, flip, onUpload, onClose]);

	const handleClose = useCallback(() => {
		setImageSrc(null);
		setCrop({x: 0, y: 0});
		setZoom(1);
		setRotation(0);
		setFlip({horizontal: false, vertical: false});
		onClose();
	}, [onClose]);

	const handleZoneClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleBack = useCallback(() => {
		setImageSrc(null);
		setCrop({x: 0, y: 0});
		setZoom(1);
		setRotation(0);
		setFlip({horizontal: false, vertical: false});
	}, []);

	return (
		<Overlay
			isOpen={isOpen}
			onClose={handleClose}
			className='w-full max-w-2xl bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6'
		>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-lg font-semibold text-white'>
					{imageSrc ? "Chọn vùng ảnh bìa" : "Cập nhật ảnh bìa"}
				</h3>
				<button
					onClick={handleClose}
					className='p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer'
				>
					<X className='w-5 h-5 text-white/60' />
				</button>
			</div>

			{imageSrc ? (
				<div className='space-y-4'>
					<div className='relative w-full h-48 bg-black/50 rounded-xl overflow-hidden'>
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							rotation={rotation}
							aspect={16 / 9}
							showGrid={false}
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropComplete}
							transform={[
								`translate(${crop.x}px, ${crop.y}px)`,
								`rotate(${rotation}deg)`,
								`scale(${zoom})`,
								flip.horizontal ? "scaleX(-1)" : "",
								flip.vertical ? "scaleY(-1)" : "",
							].join(" ")}
						/>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2 flex-1'>
							<ZoomOut className='w-4 h-4 text-white/40' />
							<RangeInput
								min={1}
								max={3}
								step={0.1}
								value={zoom}
								onChange={setZoom}
							/>
							<ZoomIn className='w-4 h-4 text-white/40' />
						</div>
						<div className='flex items-center gap-2'>
							<button
								onClick={() =>
									setFlip((prev) => ({
										...prev,
										horizontal: !prev.horizontal,
									}))
								}
								className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
								title='Lật ảnh'
							>
								<FlipHorizontal className='w-4 h-4 text-white/60' />
							</button>
							<button
								onClick={() => setRotation((r) => r + 90)}
								className='p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer'
								title='Xoay ảnh'
							>
								<RotateCw className='w-4 h-4 text-white/60' />
							</button>
						</div>
					</div>

					<div className='flex gap-3'>
						<Button
							onClick={handleBack}
							className='flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10'
						>
							Chọn ảnh khác
						</Button>
						<Button
							onClick={handleConfirm}
							disabled={loading}
							className='flex-1 bg-[#ff79c6] hover:bg-[#ff79c6]/90 text-white'
						>
							{loading ? (
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									Đang xử lý...
								</>
							) : (
								"Xác nhận"
							)}
						</Button>
					</div>
				</div>
			) : (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={handleZoneClick}
					className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
						isDragging
							? "border-[#ff79c6] bg-[#ff79c6]/10"
							: "border-white/20 hover:border-white/40 hover:bg-white/5"
					}`}
				>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleFileSelect}
						className='hidden'
					/>

					{loading ? (
						<div className='flex flex-col items-center gap-3'>
							<Loader2 className='w-10 h-10 text-[#ff79c6] animate-spin' />
							<p className='text-white/60 text-sm'>
								Đang xử lý...
							</p>
						</div>
					) : (
						<>
							<div className='flex items-center justify-center gap-2 mb-2'>
								<Upload className='w-5 h-5' />
								<p className='text-white font-medium'>
									Kéo thả ảnh vào đây
								</p>
							</div>
							<p className='text-white/50 text-sm'>
								hoặc nhấn để chọn ảnh (khuyến nghị tỉ lệ 16:9)
							</p>
						</>
					)}
				</div>
			)}
		</Overlay>
	);
};

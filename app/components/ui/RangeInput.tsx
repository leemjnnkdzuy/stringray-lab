"use client";

import React from "react";

interface RangeInputProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	className?: string;
	disabled?: boolean;
}

export const RangeInput = ({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	className = "",
	disabled = false,
}: RangeInputProps) => {
	const percentage = ((value - min) / (max - min)) * 100;

	return (
		<input
			type='range'
			min={min}
			max={max}
			step={step}
			value={value}
			disabled={disabled}
			onChange={(e) => onChange(Number(e.target.value))}
			className={`
				w-full h-1.5 rounded-full appearance-none cursor-pointer
				[&::-webkit-slider-runnable-track]:bg-white/10
				[&::-webkit-slider-runnable-track]:rounded-full
				[&::-webkit-slider-runnable-track]:h-1.5
				[&::-webkit-slider-thumb]:appearance-none
				[&::-webkit-slider-thumb]:w-4
				[&::-webkit-slider-thumb]:h-4
				[&::-webkit-slider-thumb]:rounded-full
				[&::-webkit-slider-thumb]:bg-white
				[&::-webkit-slider-thumb]:shadow-lg
				[&::-webkit-slider-thumb]:shadow-black/20
				[&::-webkit-slider-thumb]:border-2
				[&::-webkit-slider-thumb]:border-white/60
				[&::-webkit-slider-thumb]:-mt-[5px]
				[&::-webkit-slider-thumb]:transition-transform
				[&::-webkit-slider-thumb]:hover:scale-110
				[&::-moz-range-track]:bg-white/10
				[&::-moz-range-track]:rounded-full
				[&::-moz-range-track]:h-1.5
				[&::-moz-range-thumb]:appearance-none
				[&::-moz-range-thumb]:w-4
				[&::-moz-range-thumb]:h-4
				[&::-moz-range-thumb]:rounded-full
				[&::-moz-range-thumb]:bg-white
				[&::-moz-range-thumb]:border-2
				[&::-moz-range-thumb]:border-white/60
				disabled:opacity-50
				disabled:cursor-not-allowed
				${className}
			`}
			style={{
				background: `linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`,
			}}
		/>
	);
};

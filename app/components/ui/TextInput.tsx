import React from "react";
import {LucideIcon} from "lucide-react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	icon?: LucideIcon;
	rightElement?: React.ReactNode;
	containerClassName?: string;
}

export const TextInput = ({
	label,
	icon: Icon,
	rightElement,
	containerClassName,
	className,
	...props
}: TextInputProps) => {
	return (
		<div className={`space-y-2 ${containerClassName || ""}`}>
			{label && (
				<label className='text-sm font-medium text-white/70 ml-1'>
					{label}
				</label>
			)}
			<div className='relative group'>
				{Icon && (
					<div className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#ff79c6] transition-colors'>
						<Icon className='w-5 h-5' />
					</div>
				)}
				<input
					className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${
						Icon ? "pl-10" : "pl-4"
					} ${
						rightElement ? "pr-12" : "pr-4"
					} text-white placeholder-white/30 focus:outline-none focus:border-[#ff79c6]/50 focus:ring-1 focus:ring-[#ff79c6]/50 transition-all ${
						className || ""
					}`}
					{...props}
				/>
				{rightElement && (
					<div className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors flex items-center justify-center'>
						{rightElement}
					</div>
				)}
			</div>
		</div>
	);
};

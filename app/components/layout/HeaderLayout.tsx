import React from "react";
import {HomeHeader} from "@/app/components/common/HomeHeader";

interface HeaderLayoutProps {
	children: React.ReactNode;
}

export const HeaderLayout = ({children}: HeaderLayoutProps) => {
	return (
		<div className='h-screen bg-[#000000] text-white selection:bg-[#ff79c6]/30 flex flex-col overflow-hidden'>
			<HomeHeader />
			<main className='relative z-0 flex-1 overflow-y-auto'>
				{children}
			</main>
		</div>
	);
};

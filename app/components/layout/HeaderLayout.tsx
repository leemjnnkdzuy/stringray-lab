import React from "react";
import {HomeHeader} from "@/app/components/common/HomeHeader";

interface HeaderLayoutProps {
	children: React.ReactNode;
}

export const HeaderLayout = ({children}: HeaderLayoutProps) => {
	return (
		<div className='min-h-screen bg-[#000000] text-white selection:bg-[#ff79c6]/30'>
			<HomeHeader />
			<main className='relative z-0'>{children}</main>
		</div>
	);
};

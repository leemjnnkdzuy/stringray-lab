import React from "react";

interface EditorLayoutProps {
	children: React.ReactNode;
}

const EditorLayout = ({children}: EditorLayoutProps) => {
	return (
		<div className='h-screen bg-[#0a0a0a] text-white selection:bg-[#ff79c6]/30 flex flex-col overflow-hidden'>
			{children}
		</div>
	);
};

export default EditorLayout;

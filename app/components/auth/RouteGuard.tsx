"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

interface UserInfo {
	id: string;
	username: string;
	email: string;
	avatar?: string;
}

export function PrivateRoute({children}: {children: React.ReactNode}) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserInfo | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					router.push("/");
				}
			} catch {
				router.push("/");
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, [router]);

	if (loading) {
		return (
			<div className='min-h-screen bg-black text-white flex items-center justify-center'>
				<Loader2 className='w-8 h-8 animate-spin text-white/50' />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}

export function PublicRoute({children}: {children: React.ReactNode}) {
	return <>{children}</>;
}

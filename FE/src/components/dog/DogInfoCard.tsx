import type { ReactNode } from "react";

interface DogInfoCardProps {
	title: string;
	children: ReactNode;
}

export default function DogInfoCard({ title, children }: DogInfoCardProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-bold text-lg">{title}</span>
			<div className="flex flex-col gap-2 bg-white p-2.5 rounded-[8px] shadow-custom-sm">
				{children}
			</div>
		</div>
	);
}

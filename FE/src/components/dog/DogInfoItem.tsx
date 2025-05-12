import type { ReactNode } from "react";

interface DogInfoItemProps {
	label: string;
	value: string | ReactNode;
	className?: string;
}

export default function DogInfoItem({
	label,
	value,
	className = "",
}: DogInfoItemProps) {
	return (
		<div className={`flex  ${className}`}>
			<span className="flex-1/5 font-medium py-2 px-2 w-20">{label}</span>
			<span className="flex-4/5 text-grayText font-semibold bg-background py-2 px-5 rounded-[8px]">
				{value}
			</span>
		</div>
	);
}

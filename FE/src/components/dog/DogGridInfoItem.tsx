import type { ReactNode } from "react";

interface DogGridInfoItemProps {
	label: string;
	value: string | ReactNode;
}

export default function DogGridInfoItem({
	label,
	value,
}: DogGridInfoItemProps) {
	return (
		<div className="flex gap-2">
			<span className="flex-1/3 font-medium py-2 px-2">{label}</span>
			<span className="flex-2/3 text-grayText font-semibold bg-background p-2 rounded-full text-center">
				{value}
			</span>
		</div>
	);
}

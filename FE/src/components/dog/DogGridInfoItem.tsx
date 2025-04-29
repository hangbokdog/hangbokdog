interface DogGridInfoItemProps {
	label: string;
	value: string;
}

export default function DogGridInfoItem({
	label,
	value,
}: DogGridInfoItemProps) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<span className="font-medium py-2 px-2">{label}</span>
			<span className="text-grayText font-semibold bg-background p-2 rounded-full text-center">
				{value}
			</span>
		</div>
	);
}

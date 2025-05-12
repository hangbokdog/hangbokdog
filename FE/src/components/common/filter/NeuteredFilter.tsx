import { cn } from "@/lib/utils";

interface NeuteredFilterProps {
	isNeutered?: boolean;
	onSelect: (value: boolean) => void;
}

export default function NeuteredFilter({
	isNeutered,
	onSelect,
}: NeuteredFilterProps) {
	return (
		<div className="flex gap-2">
			<button
				onClick={() => onSelect(true)}
				className={cn(
					"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
					isNeutered === true
						? "bg-primary text-white"
						: "bg-gray-100",
				)}
				type="button"
			>
				완료
			</button>
			<button
				onClick={() => onSelect(false)}
				className={cn(
					"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
					isNeutered === false
						? "bg-primary text-white"
						: "bg-gray-100",
				)}
				type="button"
			>
				미완료
			</button>
		</div>
	);
}

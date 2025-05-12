import { cn } from "@/lib/utils";
import { type Gender, GenderLabel } from "@/types/dog";

interface GenderFilterProps {
	selectedGender?: Gender;
	onSelect: (gender: Gender) => void;
}

export default function GenderFilter({
	selectedGender,
	onSelect,
}: GenderFilterProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(GenderLabel).map(([key, label]) => (
				<button
					key={key}
					onClick={() => onSelect(key as Gender)}
					className={cn(
						"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
						selectedGender === key
							? "bg-primary text-white"
							: "bg-gray-100",
					)}
					type="button"
				>
					{label}
				</button>
			))}
		</div>
	);
}

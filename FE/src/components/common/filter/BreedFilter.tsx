import { cn } from "@/lib/utils";
import { type DogBreed, DogBreedLabel } from "@/types/dog";

interface BreedFilterProps {
	selectedBreeds: DogBreed[];
	onSelect: (breed: DogBreed) => void;
}

export default function BreedFilter({
	selectedBreeds,
	onSelect,
}: BreedFilterProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(DogBreedLabel).map(([key, label]) => (
				<button
					key={key}
					onClick={() => onSelect(key as DogBreed)}
					className={cn(
						"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
						selectedBreeds.includes(key as DogBreed)
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

import type { AddressBook } from "@/api/center";
import { cn } from "@/lib/utils";

interface LocationFilterProps {
	selectedLocations: string[];
	addressBook: AddressBook[];
	onSelect: (location: string) => void;
}

export default function LocationFilter({
	selectedLocations,
	addressBook,
	onSelect,
}: LocationFilterProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{addressBook.length > 0 ? (
				addressBook.map((address) => (
					<button
						key={address.id}
						onClick={() => onSelect(address.id.toString())}
						className={cn(
							"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
							selectedLocations.includes(address.id.toString())
								? "bg-black text-white"
								: "bg-gray-100",
						)}
						type="button"
					>
						{address.addressName}
					</button>
				))
			) : (
				<p className="text-sm text-gray-500 col-span-full">
					등록된 주소록이 없습니다.
				</p>
			)}
		</div>
	);
}

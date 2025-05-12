import type { AddressBook } from "@/api/center";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LocationLabel } from "@/types/center";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface AddressDropdownProps {
	addresses: AddressBook[];
	selectedId: number | null;
	onSelect?: (id: number) => void;
}

export default function AddressDropdown({
	addresses,
	selectedId,
	onSelect,
}: AddressDropdownProps) {
	const [open, setOpen] = useState(false);

	const selectedAddress = addresses.find(
		(address) => address.id === selectedId,
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-expanded={open}
					className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
				>
					{selectedAddress
						? selectedAddress.addressName
						: "센터 선택"}
					<ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="센터 검색..." />
					<CommandList>
						<CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
						<CommandGroup>
							{addresses.map((address) => (
								<CommandItem
									key={address.id}
									value={address.addressName}
									onSelect={() => {
										onSelect?.(address.id);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedId === address.id
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									<div className="flex flex-col">
										<span>{address.addressName}</span>
										<span className="text-xs text-gray-500">
											{LocationLabel[address.address]}
										</span>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboBoxItem {
	value: string;
	label: string;
}

interface ComboBoxProps {
	items: ComboBoxItem[];
	defaultText: string;
	selectedValue: string;
	onSelect: (value: string) => void;
	variant?: "default" | "simple";
}

export default function ComboBox({
	items,
	defaultText,
	selectedValue,
	onSelect,
	variant = "default",
}: ComboBoxProps) {
	const [open, setOpen] = useState(false);

	const buttonClassName =
		variant === "simple"
			? "w-[150px] h-10 justify-between text-grayText border border-gray-300 bg-transparent rounded text-lg"
			: "w-[150px] h-6 justify-between text-grayText bg-transparent border-t-0 border-b-0 border-r-0 border-l-2 shadow-none rounded-none border-blueGray bg-gradient-to-r from-[var(--color-blueGray)]/20";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={open}
					className={buttonClassName}
				>
					{selectedValue || defaultText}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[150px] p-0">
				<Command>
					<CommandList>
						<CommandEmpty>{defaultText}</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										onSelect(currentValue);
										setOpen(false);
									}}
								>
									{item.label}
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedValue === item.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

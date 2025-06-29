import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			className,
			checked = false,
			onCheckedChange,
			disabled = false,
			...props
		},
		ref,
	) => {
		const handleClick = () => {
			if (!disabled && onCheckedChange) {
				onCheckedChange(!checked);
			}
		};

		return (
			<button
				ref={ref}
				role="switch"
				aria-checked={checked}
				data-state={checked ? "checked" : "unchecked"}
				aria-disabled={disabled}
				onClick={handleClick}
				className={cn(
					"inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					checked ? "bg-blue-500" : "bg-gray-200",
					disabled && "opacity-50 cursor-not-allowed",
					className,
				)}
				{...props}
			>
				<span
					className={cn(
						"pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
						checked ? "translate-x-5" : "translate-x-0",
					)}
				/>
			</button>
		);
	},
);

Switch.displayName = "Switch";

export { Switch };

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

// 사용 시 htmlFor 속성을 통해 input 요소와 연결해야 합니다
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => {
		return (
			// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
			<label
				ref={ref}
				className={cn(
					"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
					className,
				)}
				{...props}
			/>
		);
	},
);

Label.displayName = "Label";

export { Label };

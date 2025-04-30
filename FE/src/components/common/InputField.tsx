import type { IconType } from "react-icons";

interface InputFieldProps {
	icon: IconType;
	placeholder: string;
	value?: string;
	disabled?: boolean;
	maxLength?: number;
	minLength?: number;
	type?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
	icon: Icon,
	placeholder,
	value,
	disabled = false,
	maxLength,
	minLength,
	type = "text",
	onChange,
}: InputFieldProps) {
	return (
		<div className="flex flex-1 w-full bg-background rounded-3xl shadow-custom-sm px-3 py-2 transition-all duration-200 hover:shadow-md">
			<div className="flex items-center justify-center border-r border-grayText p-2">
				<Icon className="size-5 text-grayText" />
			</div>
			<input
				className="flex-1 outline-none ml-2"
				type={type}
				placeholder={placeholder}
				value={value}
				disabled={disabled}
				maxLength={maxLength}
				minLength={minLength}
				onChange={onChange}
			/>
		</div>
	);
}

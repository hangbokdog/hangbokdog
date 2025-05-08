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
	error?: boolean;
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
	error = false,
}: InputFieldProps) {
	return (
		<div
			className={`flex flex-1 w-full rounded-3xl shadow-custom-sm px-3 py-2 transition-all duration-200 hover:shadow-md ${
				disabled ? "bg-superLightGray" : "bg-background"
			} ${error ? "border-2 border-red" : ""}`}
		>
			<div className="flex items-center justify-center border-r border-grayText p-2">
				<Icon
					className={`size-5 ${error ? "text-red" : "text-grayText"}`}
				/>
			</div>
			<input
				className={`flex-1 outline-none ml-2 ${error ? "text-red" : ""} placeholder:text-grayText`}
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

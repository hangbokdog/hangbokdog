interface RegisterTagProps {
	register: "MOVING" | "VOLUNTEER" | "DONATION";
	selected: boolean;
	onClick: (value: "MOVING" | "VOLUNTEER" | "DONATION") => void;
}

export default function RegisterTag({
	register,
	selected,
	onClick,
}: RegisterTagProps) {
	const registerConfig = {
		MOVING: { text: "이동" },
		VOLUNTEER: { text: "일손" },
		DONATION: { text: "후원" },
	} as const;

	const bgColor = selected ? "bg-main" : "bg-lightGray";
	const { text } = registerConfig[register];

	return (
		<button
			type="button"
			onClick={() => onClick(register)}
			className={`px-2 py-0.5 text-xs text-white rounded-full ${bgColor}`}
		>
			{text}
		</button>
	);
}

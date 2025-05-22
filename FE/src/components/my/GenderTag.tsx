interface GenderTagProps {
	gender: "MALE" | "FEMALE";
	className?: string; // 추가 스타일링용
}

export default function GenderTag({ gender, className = "" }: GenderTagProps) {
	const bgColor = gender === "FEMALE" ? "bg-female" : "bg-male";
	const text = gender === "FEMALE" ? "여아" : "남아";

	return (
		<span
			className={`px-1.5 text-xs text-white rounded-full ${bgColor} ${className}`}
		>
			{text}
		</span>
	);
}

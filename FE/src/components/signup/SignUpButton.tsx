import Spinner from "@/components/ui/spinner";

interface SignUpButtonProps {
	isEnabled: boolean;
	onClick: () => void;
	isSubmitting?: boolean;
}

export default function SignUpButton({
	isEnabled,
	onClick,
	isSubmitting = false,
}: SignUpButtonProps) {
	return (
		<button
			type="button"
			className={`w-full rounded-[8px] ${isEnabled ? "bg-main" : "bg-superLightGray cursor-not-allowed"} inline-flex items-center justify-center gap-2 py-4`}
			onClick={onClick}
			disabled={!isEnabled || isSubmitting}
		>
			{isSubmitting ? (
				<>
					<Spinner size="small" />
					<span className="text-white font-semibold text-lg">
						처리중...
					</span>
				</>
			) : (
				<span className="text-white font-semibold text-lg">
					가입하기
				</span>
			)}
		</button>
	);
}

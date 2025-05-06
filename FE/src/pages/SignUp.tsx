import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpForm from "@/components/signup/SignUpForm";
import SignUpTerms from "@/components/signup/SignUpTerms";
import SignUpButton from "@/components/signup/SignUpButton";
import { useMutation } from "@tanstack/react-query";
import { signUpAPI } from "@/api/auth";

export default function SignUp() {
	const signUpMutation = useMutation({
		mutationFn: signUpAPI,
		onSuccess: () => {
			toast.success("회원가입에 성공했습니다!");
			navigate("/");
		},
		onError: () => {
			toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
			setIsSubmitting(false);
		},
	});

	const handleSubmit = () => {
		if (!isFormValid) {
			toast.error("모든 항목을 올바르게 입력해주세요.");
			return;
		}

		setIsSubmitting(true);

		if (signupTimeoutRef.current) {
			clearTimeout(signupTimeoutRef.current);
		}

		signupTimeoutRef.current = setTimeout(() => {
			const formattedBirthDate = formatBirthDate(birthDate);

			signUpMutation.mutate({
				name: name || "",
				nickname,
				phoneNumber,
				birthDate: formattedBirthDate,
			});
		}, 300);
	};
	return (
		<div className="p-2.5 py-10 flex flex-col items-center gap-5 rounded-[8px] bg-white shadow-custom-xs mx-2.5">
			<SignUpHeader />
			<SignUpButton
				isEnabled={isFormValid && !isSubmitting}
				onClick={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}

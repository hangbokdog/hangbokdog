import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpForm from "@/components/signup/SignUpForm";
import SignUpTerms from "@/components/signup/SignUpTerms";
import SignUpButton from "@/components/signup/SignUpButton";

export default function SignUp() {
	return (
		<div className="p-2.5 py-10 flex flex-col items-center gap-5 rounded-[8px] bg-white shadow-custom-xs mx-2.5">
			<SignUpHeader />
			<SignUpForm />
			<SignUpTerms />
			<SignUpButton />
		</div>
	);
}

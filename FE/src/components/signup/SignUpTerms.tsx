import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpTerms() {
	return (
		<div className="flex items-center space-x-2">
			<Checkbox id="terms" />
			<label
				htmlFor="terms"
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				이용약관을 확인하였습니다.
			</label>
		</div>
	);
}

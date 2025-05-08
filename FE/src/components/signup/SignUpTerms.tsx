import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import TermsContent from "./TermsContent";

interface SignUpTermsProps {
	isChecked: boolean;
	onChange: (checked: boolean) => void;
}

export default function SignUpTerms({ isChecked, onChange }: SignUpTermsProps) {
	return (
		<div className="flex items-center space-x-2">
			<Checkbox
				id="terms"
				checked={isChecked}
				onCheckedChange={onChange}
			/>
			<label
				htmlFor="terms"
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				<Dialog>
					<DialogTrigger asChild>
						<span className="underline cursor-pointer">
							이용약관
						</span>
					</DialogTrigger>
					<DialogContent className="max-w-3xl">
						<DialogHeader>
							<DialogTitle>서비스 이용약관</DialogTitle>
						</DialogHeader>
						<TermsContent />
					</DialogContent>
				</Dialog>
				을 확인하였습니다.
			</label>
		</div>
	);
}

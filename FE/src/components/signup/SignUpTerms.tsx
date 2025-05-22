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
	isEmergencyAlertChecked: boolean;
	onEmergencyAlertChange: (checked: boolean) => void;
}

export default function SignUpTerms({
	isChecked,
	onChange,
	isEmergencyAlertChecked,
	onEmergencyAlertChange,
}: SignUpTermsProps) {
	return (
		<div className="flex flex-col gap-3 w-full max-w-xs">
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

			<div className="flex items-center space-x-2">
				<Checkbox
					id="emergencyAlert"
					checked={isEmergencyAlertChecked}
					onCheckedChange={onEmergencyAlertChange}
				/>
				<label
					htmlFor="emergencyAlert"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					응급 상황 알림 수신에 동의합니다.
				</label>
			</div>
		</div>
	);
}

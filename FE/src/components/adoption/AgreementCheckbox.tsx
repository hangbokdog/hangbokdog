import { Checkbox } from "../ui/checkbox";

interface AgreementCheckboxProps {
	isChecked: boolean;
	setIsChecked: (checked: boolean) => void;
}

export default function AgreementCheckbox({
	isChecked,
	setIsChecked,
}: AgreementCheckboxProps) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Checkbox
				id="agreement"
				checked={isChecked}
				onCheckedChange={(checked) => setIsChecked(checked as boolean)}
				className="bg-white"
			/>
			<label
				htmlFor="agreement"
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				주의사항을 확인하였습니다.
			</label>
		</div>
	);
}

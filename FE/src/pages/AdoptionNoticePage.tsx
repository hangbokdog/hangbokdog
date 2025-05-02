import { useState } from "react";
import Title from "@/components/adoption/Title";
import AdoptionAndImboNoticeContent from "@/components/adoption/AdoptionAndImboNoticeContent";
import AdopterRequiredContent from "@/components/adoption/AdopterRequiredContent";
import ImboRequiredContent from "@/components/adoption/ImboRequiredContent";
import AdoptionButton from "@/components/adoption/AdoptionButton";
import AgreementCheckbox from "@/components/adoption/AgreementCheckbox";

export default function AdoptionNoticePage() {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div className="flex flex-col mx-2.5 pt-4 gap-4">
			<Title className="text-red">
				입양 및 임시보호 신청 전 주의 사항
			</Title>

			<AdoptionAndImboNoticeContent />

			<Title className="text-red">입양자 필수사항</Title>

			<AdopterRequiredContent />

			<Title className="text-[#BC2DCC]">임시보호시 필수사항</Title>

			<ImboRequiredContent />

			<AgreementCheckbox
				isChecked={isChecked}
				setIsChecked={setIsChecked}
			/>

			<AdoptionButton isChecked={isChecked} />
		</div>
	);
}

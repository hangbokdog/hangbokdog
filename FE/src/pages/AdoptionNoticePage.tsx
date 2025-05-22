import { useState } from "react";
import Title from "@/components/adoption/Title";
import AdoptionAndImboNoticeContent from "@/components/adoption/AdoptionAndImboNoticeContent";
import AdopterRequiredContent from "@/components/adoption/AdopterRequiredContent";
import ImboRequiredContent from "@/components/adoption/ImboRequiredContent";
import AdoptionButton from "@/components/adoption/AdoptionButton";
import AgreementCheckbox from "@/components/adoption/AgreementCheckbox";
import ImboButton from "@/components/adoption/ImboButton";

type TabType = "adoption" | "foster";

export default function AdoptionNoticePage() {
	const [isChecked, setIsChecked] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("adoption");

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
		setIsChecked(false); // 탭 전환 시 체크박스 초기화
	};

	return (
		<div className="flex flex-col mx-2.5 pt-4 gap-4 mt-2.5">
			<Title className="text-red">
				입양 및 임시보호 신청 전 주의 사항
			</Title>

			<AdoptionAndImboNoticeContent />

			{/* 탭 네비게이션 */}
			<div className="flex border-b border-gray-200">
				<button
					type="button"
					onClick={() => handleTabChange("adoption")}
					className={`py-2 px-4 font-medium text-sm flex-1 ${
						activeTab === "adoption"
							? "border-b-2 border-red text-red"
							: "text-gray-500"
					}`}
				>
					입양자 필수사항
				</button>
				<button
					type="button"
					onClick={() => handleTabChange("foster")}
					className={`py-2 px-4 font-medium text-sm flex-1 ${
						activeTab === "foster"
							? "border-b-2 border-[#BC2DCC] text-[#BC2DCC]"
							: "text-gray-500"
					}`}
				>
					임시보호시 필수사항
				</button>
			</div>

			{/* 탭 콘텐츠 */}
			{activeTab === "adoption" ? (
				<>
					<AdopterRequiredContent />
				</>
			) : (
				<>
					<ImboRequiredContent />
				</>
			)}

			<AgreementCheckbox
				isChecked={isChecked}
				setIsChecked={setIsChecked}
			/>

			{activeTab === "adoption" ? (
				<AdoptionButton isChecked={isChecked} />
			) : (
				<ImboButton isChecked={isChecked} />
			)}
		</div>
	);
}

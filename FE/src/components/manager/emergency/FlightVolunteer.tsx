import { FaChevronRight } from "react-icons/fa";
import PanelTitle from "@/components/common/PanelTitle";
import { ProfileInfo } from "@/components/my/ProfileInfo";

export default function FlightVolunteer() {
	return (
		<div className="bg-white p-2.5 rounded-xl shadow-custom-xs mx-2.5">
			{/* 링크 변경해야함 */}
			<PanelTitle
				title="이동 응급을 도와주시는 분"
				link="/manager/emergency/detail"
			/>
			<div className="flex items-center justify-between rounded-lg p-3 bg-[#f6f7f9]">
				<div className="flex items-center">
					<ProfileInfo name="홍길동" size="sm" />
				</div>
				<div className="flex items-center justify-between flex-1 ml-4">
					<span className="text-grayText text-sm truncate max-w-[140px] mr-4">
						서현이 공항 데려다주실 자원봉사자분을 구합니다.
					</span>
					<div className="flex items-center">
						<span className="text-red text-sm">D-10 시간</span>
						<FaChevronRight className="w-4 h-4 text-gray-400" />
					</div>
				</div>
			</div>
		</div>
	);
}

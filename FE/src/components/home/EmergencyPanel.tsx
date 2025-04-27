import siren from "@/assets/images/siren.png";
import { Link } from "react-router-dom";

export default function EmergencyPanel() {
	return (
		<div className="flex items-center gap-2.5">
			<div className="flex flex-col justify-center items-center px-5 py-10">
				<img className="size-10" src={siren} alt="siren" />
				<span className="relative text-lg font-semibold text-grayText">
					긴급요청
					<span className="absolute top-[-12px] right-[-17px] size-5 text-center rounded-full bg-red text-white shadow-custom-sm text-sm font-bold">
						6
					</span>
				</span>
			</div>
			<div className="flex flex-1 flex-col items-center p-2 gap-3 rounded-3xl bg-white">
				<div className="flex flex-col text-grayText text-xs font-medium">
					<div className="flex p-2 gap-2 justify-between rounded-3xl bg-background">
						<span>서현이 공항 데려다 주실 분 있나요??</span>
						<span className="text-red font-bold">D - 10시간</span>
					</div>
					<div className="flex p-2 gap-2 justify-between rounded-3xl">
						<span>도넛이 이동 도와주세요!</span>
						<span>D - 2일</span>
					</div>
					<div className="flex p-2 gap-2 justify-between rounded-3xl bg-background">
						<span>서현이 공항 데려다 주실 분 있나요??</span>
						<span>D - 10 시간</span>
					</div>
				</div>
				<Link to={"/emergency"}>
					<span className="text-grayText font-bold text-sm">
						더보기
					</span>
				</Link>
			</div>
		</div>
	);
}

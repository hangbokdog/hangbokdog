import NavigatePanel from "@/components/common/NavigatePanel";
import { FaToiletPaper } from "react-icons/fa";

export default function ManagerManagePanel() {
	return (
		<div className="pb-2.5">
			<div className="flex gap-2.5 items-center py-2">
				<div className="flex rounded-full w-6 h-6 bg-female overflow-hidden justify-center items-center">
					<FaToiletPaper className="w-6 h-6 text-orange-200" />
				</div>
				<div className="text-lg font-bold text-grayText">관리</div>
			</div>
			<div className="flex flex-col gap-2.5">
				<NavigatePanel title="봉사" navigation="/manager/volunteer" />
				<NavigatePanel title="임보" navigation="/manager/imbo" />
				<NavigatePanel title="입양" navigation="/manager/adoption" />
			</div>
		</div>
	);
}

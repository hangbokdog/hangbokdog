import { FaToiletPaper } from "react-icons/fa";

export default function ManagerManagePanel() {
	return (
		<div>
			<div className="flex gap-2.5 items-center py-2">
				<div className="flex rounded-full w-6 h-6 bg-[var(--color-female)] overflow-hidden justify-center items-center">
					<FaToiletPaper className="w-6 h-6 text-orange-200" />
				</div>
				<div className="text-lg font-bold text-grayText">관리</div>
			</div>
		</div>
	);
}

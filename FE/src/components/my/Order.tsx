import { FaChevronRight } from "react-icons/fa";
import PanelTitle from "../common/PanelTitle";

export default function Order() {
	return (
		<div className="pt-2.5 pb-2.5">
			<div className="bg-white p-2.5 pb-2.5 pt-2.5 rounded-xl shadow-custom-xs">
				<PanelTitle title="주문상태" link="/orders" />
				<div className="flex justify-between items-center">
					<div className="text-center">
						<p className="text-2xl font-bold text-gray-500">0</p>
						<p className="text-sm text-gray-500 p-2.5">상품 준비</p>
					</div>
					<FaChevronRight className="h-4 w-4 text-gray-400" />
					<div className="text-center">
						<p className="text-2xl text-gray-500 font-bold">0</p>
						<p className="text-sm text-gray-500 p-2.5">배송 중</p>
					</div>
					<FaChevronRight className="h-4 w-4 text-gray-400" />
					<div className="text-center">
						<p className="text-2xl font-bold">1</p>
						<p className="text-sm p-2.5">수령 완료</p>
					</div>
				</div>
			</div>
		</div>
	);
}

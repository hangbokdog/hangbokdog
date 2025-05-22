import { motion } from "framer-motion";
import type { AddressBook } from "@/api/center";
import VolunteerScheduleManager from "./VolunteerScheduleManager";
import { Calendar, MapPin, Users } from "lucide-react";
import { LocationLabel } from "@/types/center";

interface FilteredContentProps {
	addressId: number | null;
	addresses: AddressBook[];
	refetchAddresses: () => void;
}

export default function FilteredContent({
	addressId,
	addresses,
	refetchAddresses,
}: FilteredContentProps) {
	const selectedAddress = addresses.find(
		(address) => address.id === addressId,
	);

	return (
		<motion.div
			className="flex flex-col gap-4"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{selectedAddress ? (
				<>
					<motion.div
						className="bg-indigo-50 p-4 rounded-xl mb-2 shadow-sm border border-indigo-100"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<div className="flex items-center gap-3 mb-2">
							<div className="bg-white p-2 rounded-full shadow-sm">
								<MapPin size={16} className="" />
							</div>
							<h2 className="font-semibold">
								{selectedAddress.addressName}
							</h2>
						</div>
						<p className="text-sm  pl-9">
							{LocationLabel[selectedAddress.address]}
						</p>
						<div className="flex items-center gap-2 mt-2 pl-9">
							<Users size={14} className="text-indigo-400" />
							<span className="text-sm ">
								대기중인 총 신청자 수:{" "}
								<span className="text-red font-bold">
									{selectedAddress.appliedCount || 0}
								</span>{" "}
								명
							</span>
						</div>
					</motion.div>

					<motion.div
						className="bg-white rounded-xl overflow-hidden shadow-sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}
					>
						{/* <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-2">
							<Calendar size={18} className="text-indigo-500" />
							<h3 className="font-medium text-gray-700">
								봉사활동 일정 관리
							</h3>
						</div> */}
						{/* <div className="p-4"> */}
						<VolunteerScheduleManager
							address={selectedAddress}
							refetchAddresses={refetchAddresses}
						/>
						{/* </div> */}
					</motion.div>
				</>
			) : (
				<motion.div
					className="bg-white rounded-xl shadow-sm p-6 text-center"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
				>
					<div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4">
						<Calendar size={24} className="text-indigo-400" />
					</div>
					<p className="text-gray-500 mb-2">
						봉사활동을 관리할 센터를 선택해주세요.
					</p>
					<p className="text-xs text-gray-400">
						좌측 목록에서 센터를 선택하면 해당 센터의 봉사활동을
						관리할 수 있습니다.
					</p>
				</motion.div>
			)}
		</motion.div>
	);
}

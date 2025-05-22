import { fetchAddressBooks } from "@/api/center";
import AddressDropdown from "@/components/manager/volunteer/AddressDropdown";
import FilteredContent from "@/components/manager/volunteer/FilteredContent";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManagerVolunteerPage() {
	const { selectedCenter } = useCenterStore();
	const navigate = useNavigate();
	const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
		null,
	);

	const {
		data: addresses = [],
		isLoading,
		refetch: refetchAddresses,
	} = useQuery({
		queryKey: ["addressBooks", selectedCenter?.centerId],
		queryFn: () => fetchAddressBooks(selectedCenter?.centerId as string),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: "always",
		refetchOnWindowFocus: "always",
	});

	return (
		<div className="flex flex-col text-grayText">
			<div className="bg-white shadow-sm pb-4 pl-4 pr-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold gap-2 text-gray-800 mb-1 flex items-center">
						<Calendar className="w-5 h-5 text-green-600" />
						봉사 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 봉사 내역을
						관리하세요
					</p>
				</div>
			</div>
			<div className="flex flex-col p-2.5 gap-3">
				{isLoading ? (
					<div className="flex items-center justify-center h-12 bg-white rounded-md shadow-sm">
						<p className="text-sm text-gray-500">
							센터 정보를 불러오는 중...
						</p>
					</div>
				) : addresses.length === 0 ? (
					<div className="flex items-center justify-center h-32 bg-white rounded-md shadow-sm">
						<div className="text-center">
							<p className="text-sm text-gray-500">
								등록된 센터가 없습니다.
							</p>
							<button
								type="button"
								className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
								onClick={() => {
									navigate("/manager/center");
								}}
							>
								새 센터 등록하기
							</button>
						</div>
					</div>
				) : (
					<>
						<div className="w-full">
							<AddressDropdown
								addresses={addresses}
								selectedId={selectedAddressId}
								onSelect={setSelectedAddressId}
							/>
							<p className="mt-1 text-xs text-gray-500">
								센터를 선택하여 해당 봉사 정보를 관리하세요.
							</p>
						</div>

						<FilteredContent
							addressId={selectedAddressId}
							addresses={addresses}
							refetchAddresses={refetchAddresses}
						/>
					</>
				)}
			</div>
		</div>
	);
}

import { useState } from "react";
import type { AddressBook } from "@/api/center";
import VolunteerScheduleManager from "./VolunteerScheduleManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
	const [activeTab, setActiveTab] = useState("schedule");
	const selectedAddress = addresses.find(
		(address) => address.id === addressId,
	);

	return (
		<div className="flex flex-col gap-4">
			{selectedAddress ? (
				<Tabs
					defaultValue="schedule"
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="schedule">일정 관리</TabsTrigger>
						<TabsTrigger value="statistics">통계</TabsTrigger>
					</TabsList>

					<TabsContent value="schedule" className="mt-0">
						<VolunteerScheduleManager
							address={selectedAddress}
							refetchAddresses={refetchAddresses}
						/>
					</TabsContent>

					<TabsContent value="statistics" className="mt-0">
						<div className="bg-white rounded-lg shadow-sm p-6 text-center">
							<h3 className="text-lg font-medium mb-2">
								봉사활동 통계
							</h3>
							<p className="text-gray-500">준비 중입니다...</p>
						</div>
					</TabsContent>
				</Tabs>
			) : (
				<div className="bg-white rounded-lg shadow-sm p-6 text-center">
					<p className="text-gray-500">
						봉사활동을 관리할 센터를 선택해주세요.
					</p>
				</div>
			)}
		</div>
	);
}

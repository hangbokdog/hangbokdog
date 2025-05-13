import PillProgress from "@/components/manager/medications/PillProgress";
import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@/components/ui/custom-tab";
import { Label } from "@/components/ui/label";

export default function MedicationAddPage() {
	return (
		<div className="flex flex-col gap-4.5 items-center w-full px-4.5">
			<span className="text-2xl font-semibold">2025 정기 예방접종</span>
			<div className="w-full rounded-lg bg-white p-4 shadow-custom-sm">
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-5 items-center gap-4">
						<Label htmlFor="addressBook" className="text-right">
							지역
						</Label>
						<div className="col-span-4">{"쉼터"}</div>
					</div>
					<div className="grid grid-cols-5 items-center gap-4">
						<Label htmlFor="date" className="text-right">
							일시
						</Label>
						<div className="col-span-4">{"2025.05.05"}</div>
					</div>
					<div className="grid grid-cols-5 items-center gap-4">
						<Label htmlFor="content" className="text-right">
							접종 내용
						</Label>
						<div className="col-span-4">
							{"정기 심장사상충 예방접종"}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2.5 w-full rounded-lg bg-white p-4 shadow-custom-sm">
				<div className="flex justify-between items-center">
					<span className="text-base font-semibold">진행사항</span>
					<span className="text-base font-semibold">총 768마리</span>
				</div>
				<div className="flex items-center justify-between w-full p-4">
					<div className="grid grid-cols-5 grid-rows-2 gap-2 items-center w-[60%]">
						<div className="col-span-2 text-sm font-medium text-gray-800">
							완료
						</div>
						<div className="col-span-3">
							<div className="bg-gray-100 text-center rounded-full px-4 py-1 font-bold text-gray-700">
								543
							</div>
						</div>

						<div className="col-span-2 text-sm font-medium text-gray-800">
							미완료
						</div>
						<div className="col-span-3">
							<div className="bg-gray-100 text-center rounded-full px-4 py-1 font-bold text-gray-700">
								225
							</div>
						</div>
					</div>

					<PillProgress />
				</div>
			</div>
			<div className="flex flex-col gap-2.5 w-full rounded-lg bg-white shadow-custom-sm">
				<Tabs defaultActiveKey="temporary">
					<TabList>
						<Tab tabKey="temporary">임시 저장</Tab>
						<Tab tabKey="completed">완료</Tab>
					</TabList>
					<TabPanels>
						<TabPanel tabKey="temporary">
							<div className="p-4">
								<span className="text-gray-800">
									임시 저장된 항목 목록
								</span>
							</div>
						</TabPanel>
						<TabPanel tabKey="completed">
							<div className="p-4">
								<span className="text-gray-800">
									완료된 항목 목록
								</span>
							</div>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</div>
	);
}

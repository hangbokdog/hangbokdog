import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ScheduleItem, SelectedSchedule } from "@/types/volunteer";

interface VolunteerScheduleTableProps {
	scheduleData: ScheduleItem[];
	selectedSchedules: SelectedSchedule[];
	onScheduleSelect: (
		date: string,
		time: "morning" | "afternoon",
		capacity: string,
	) => void;
}

export default function VolunteerScheduleTable({
	scheduleData,
	selectedSchedules,
	onScheduleSelect,
}: VolunteerScheduleTableProps) {
	return (
		<div className="overflow-x-auto bg-white rounded-[8px] shadow-custom-sm">
			<Table className="border-collapse w-full">
				<TableHeader className="border-b border-lightGray">
					<TableRow className="[&:hover]:bg-transparent ">
						<TableHead className="w-1/3 text-center py-4 px-3 text-base font-medium border border-white">
							날짜
						</TableHead>
						<TableHead className="w-1/3 text-center py-4 px-3 text-base font-medium border border-white">
							오전
						</TableHead>
						<TableHead className="w-1/3 text-center py-4 px-3 text-base font-medium border border-white">
							오후
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{scheduleData.map((item) => (
						<TableRow
							key={item.date}
							className="!border-0 [&:hover]:bg-transparent"
						>
							<TableCell className="w-1/3 text-center py-4 text-base border border-white">
								{item.date}
							</TableCell>
							<TableCell
								onClick={() =>
									onScheduleSelect(
										item.date,
										"morning",
										item.morning,
									)
								}
								className={`w-1/3 text-center py-4 text-base cursor-pointer border border-white hover:bg-blue-50 ${
									item.morning === "6/6" ? "text-red-500" : ""
								} ${
									selectedSchedules.some(
										(s) =>
											s.date === item.date &&
											s.time === "morning",
									)
										? "bg-blue-50"
										: ""
								}`}
							>
								{item.morning}
							</TableCell>
							<TableCell
								onClick={() =>
									onScheduleSelect(
										item.date,
										"afternoon",
										item.afternoon,
									)
								}
								className={`w-1/3 text-center py-4 text-base cursor-pointer border border-white hover:bg-blue-50 ${
									item.afternoon === "6/6"
										? "text-red-500"
										: ""
								} ${
									selectedSchedules.some(
										(s) =>
											s.date === item.date &&
											s.time === "afternoon",
									)
										? "bg-blue-50"
										: ""
								}`}
							>
								{item.afternoon}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ScheduleItem } from "@/types/volunteer";
import { Link } from "react-router-dom";

interface ScheduleTableProps {
	scheduleData: ScheduleItem[];
	isManager?: boolean;
	onClickCell?: (date: string, period: "morning" | "afternoon") => void;
	selectedDate?: string;
	selectedPeriod?: "morning" | "afternoon";
}

export default function ScheduleTable({
	scheduleData,
	isManager = false,
	onClickCell,
	selectedDate,
	selectedPeriod,
}: ScheduleTableProps) {
	return (
		<div className="flex flex-col gap-4">
			<Table className="border-collapse">
				<TableHeader>
					<TableRow className="border-b border-gray-200">
						<TableHead className="text-center font-medium bg-background py-2.5 text-base">
							날짜
						</TableHead>
						<TableHead className="text-center font-medium bg-background py-2.5 text-base">
							오전
						</TableHead>
						<TableHead className="text-center font-medium bg-background py-2.5 text-base">
							오후
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{scheduleData.map((item) => (
						<TableRow
							key={item.date}
							className="border-b border-lightGrayText"
						>
							<TableCell className="text-center py-3 text-sm">
								{item.date}
							</TableCell>
							<TableCell
								className={`text-center py-3 text-sm ${
									item.morning === "6/6" ? "text-red" : ""
								} ${isManager ? "cursor-pointer hover:bg-gray-50" : ""} ${
									selectedDate === item.date &&
									selectedPeriod === "morning"
										? "bg-blue-50"
										: ""
								}`}
								onClick={() =>
									isManager &&
									onClickCell &&
									onClickCell(item.date, "morning")
								}
							>
								{item.morning}
							</TableCell>
							<TableCell
								className={`text-center py-3 text-sm ${
									item.afternoon === "6/6" ? "text-red" : ""
								} ${isManager ? "cursor-pointer hover:bg-gray-50" : ""} ${
									selectedDate === item.date &&
									selectedPeriod === "afternoon"
										? "bg-blue-50"
										: ""
								}`}
								onClick={() =>
									isManager &&
									onClickCell &&
									onClickCell(item.date, "afternoon")
								}
							>
								{item.afternoon}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{!isManager && (
				<div className="flex justify-center">
					<Link to="apply">
						<button
							type="button"
							className="bg-main text-white rounded-full py-3 px-8"
						>
							봉사신청
						</button>
					</Link>
				</div>
			)}
		</div>
	);
}

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface ScheduleItem {
	date: string;
	morning: string;
	afternoon: string;
}

interface ScheduleTableProps {
	scheduleData: ScheduleItem[];
}

export default function ScheduleTable({ scheduleData }: ScheduleTableProps) {
	return (
		<div className="flex flex-col gap-4">
			<Table className="border-collapse">
				<TableHeader>
					<TableRow className="border-b border-gray-200">
						<TableHead className="text-center font-medium bg-background py-2.5 text-base">
							날짜(요일)
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
								}`}
							>
								{item.morning}
							</TableCell>
							<TableCell
								className={`text-center py-3 text-sm ${
									item.afternoon === "6/6" ? "text-red" : ""
								}`}
							>
								{item.afternoon}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<div className="flex justify-center">
				<button
					type="button"
					className="bg-main text-white rounded-full py-3 px-8"
				>
					봉사신청
				</button>
			</div>
		</div>
	);
}

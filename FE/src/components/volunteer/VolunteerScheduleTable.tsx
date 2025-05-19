import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ScheduleItem, SelectedSchedule } from "@/types/volunteer";
import { parseISO, format, isBefore, startOfDay } from "date-fns";

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
	// 오늘 날짜
	const today = startOfDay(new Date());

	// 날짜 문자열을 Date 객체로 변환하는 함수
	const parseScheduleDate = (dateStr: string) => {
		try {
			// M.DD(요일) 형식 변환 (예: 4.15(월))
			const datePart = dateStr.split("(")[0]; // "4.15" 추출
			const [month, day] = datePart.split(".").map(Number);

			// 현재 연도 사용
			const year = new Date().getFullYear();

			// 유효한 날짜 객체 생성
			const date = new Date(year, month - 1, day);
			return date;
		} catch (error) {
			// 날짜 파싱 오류시 현재 날짜 반환 (오류 방지)
			return new Date();
		}
	};

	// 각 날짜가 과거인지 확인하는 함수
	const isPastDate = (dateStr: string) => {
		const date = parseScheduleDate(dateStr);
		return isBefore(date, today);
	};

	// 셀의 상태를 확인하는 함수 (꽉 찼거나 과거 날짜인 경우)
	const isCellDisabled = (dateStr: string, capacityStr: string) => {
		// 날짜가 과거인 경우
		if (isPastDate(dateStr)) return true;

		// 정원이 다 찬 경우 (6/6 형식에서 확인)
		const [current, max] = capacityStr.split("/").map(Number);
		return current >= max;
	};

	// 셀 텍스트 표시 함수
	const getCellContent = (dateStr: string, capacityStr: string) => {
		if (isPastDate(dateStr)) {
			return "마감";
		}
		return capacityStr;
	};

	// 셀 클릭 핸들러 래퍼
	const handleCellClick = (
		date: string,
		time: "morning" | "afternoon",
		capacity: string,
	) => {
		if (!isCellDisabled(date, capacity)) {
			onScheduleSelect(date, time, capacity);
		}
	};

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
					{scheduleData.map((item) => {
						const isPast = isPastDate(item.date);
						const isMorningDisabled = isCellDisabled(
							item.date,
							item.morning,
						);
						const isAfternoonDisabled = isCellDisabled(
							item.date,
							item.afternoon,
						);
						const isMorningSelected = selectedSchedules.some(
							(s) => s.date === item.date && s.time === "morning",
						);
						const isAfternoonSelected = selectedSchedules.some(
							(s) =>
								s.date === item.date && s.time === "afternoon",
						);

						return (
							<TableRow
								key={item.date}
								className="!border-0 [&:hover]:bg-transparent"
							>
								<TableCell
									className={`w-1/3 text-center py-4 text-base border border-white ${isPast ? "text-gray-400" : ""}`}
								>
									{item.date}
								</TableCell>
								<TableCell
									onClick={() =>
										handleCellClick(
											item.date,
											"morning",
											item.morning,
										)
									}
									className={`w-1/3 text-center py-4 text-base border border-white
										${!isMorningDisabled ? "cursor-pointer hover:bg-blue-50" : "cursor-not-allowed"}
										${isMorningDisabled ? "text-gray-400 bg-gray-50 line-through" : ""}
										${item.morning === "6/6" && !isPast ? "text-red-500" : ""}
										${isMorningSelected ? "bg-blue-50" : ""}
									`}
								>
									{getCellContent(item.date, item.morning)}
								</TableCell>
								<TableCell
									onClick={() =>
										handleCellClick(
											item.date,
											"afternoon",
											item.afternoon,
										)
									}
									className={`w-1/3 text-center py-4 text-base border border-white
										${!isAfternoonDisabled ? "cursor-pointer hover:bg-blue-50" : "cursor-not-allowed"}
										${isAfternoonDisabled ? "text-gray-400 bg-gray-50 line-through" : ""}
										${item.afternoon === "6/6" && !isPast ? "text-red-500" : ""}
										${isAfternoonSelected ? "bg-blue-50" : ""}
									`}
								>
									{getCellContent(item.date, item.afternoon)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

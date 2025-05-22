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
import { useMemo } from "react";
import { parseISO, format, isBefore, startOfDay } from "date-fns";

interface ScheduleTableProps {
	scheduleData: ScheduleItem[];
	isManager?: boolean;
	onClickCell?: (date: string, period: "morning" | "afternoon") => void;
	selectedDate?: string;
	selectedPeriod?: "morning" | "afternoon";
	timeInfo?: string;
	status?: string;
}

export default function ScheduleTable({
	scheduleData,
	isManager = false,
	onClickCell,
	selectedDate,
	selectedPeriod,
	timeInfo,
	status,
}: ScheduleTableProps) {
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

	return (
		<div className="flex flex-col gap-4">
			<span className="text-primary font-medium text-center">
				{timeInfo}
			</span>
			<Table className="border-collapse">
				<TableHeader>
					<TableRow className="border-b border-gray-200">
						<TableHead className="w-1/3 text-center font-medium bg-background py-2.5 text-base">
							날짜
						</TableHead>
						<TableHead className="w-1/3 text-center font-medium bg-background py-2.5 text-base">
							오전
						</TableHead>
						<TableHead className="w-1/3 text-center font-medium bg-background py-2.5 text-base">
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

						return (
							<TableRow
								key={item.date}
								className="border-b border-lightGrayText"
							>
								<TableCell
									className={`text-center py-3 text-sm ${isPast ? "text-gray-400" : ""}`}
								>
									{item.date}
								</TableCell>
								<TableCell
									className={`text-center py-3 text-sm 
										${isMorningDisabled ? "text-gray-400 bg-gray-50" : item.morning === "6/6" ? "text-red" : ""} 
										${isManager && !isMorningDisabled ? "cursor-pointer hover:bg-gray-50" : ""} 
										${selectedDate === item.date && selectedPeriod === "morning" ? "bg-blue-50" : ""}
										${isMorningDisabled ? "line-through" : ""}`}
									onClick={() =>
										isManager &&
										onClickCell &&
										!isMorningDisabled &&
										onClickCell(item.date, "morning")
									}
								>
									{getCellContent(item.date, item.morning)}
								</TableCell>
								<TableCell
									className={`text-center py-3 text-sm 
										${isAfternoonDisabled ? "text-gray-400 bg-gray-50" : item.afternoon === "6/6" ? "text-red" : ""} 
										${isManager && !isAfternoonDisabled ? "cursor-pointer hover:bg-gray-50" : ""} 
										${selectedDate === item.date && selectedPeriod === "afternoon" ? "bg-blue-50" : ""}
										${isAfternoonDisabled ? "line-through" : ""}`}
									onClick={() =>
										isManager &&
										onClickCell &&
										!isAfternoonDisabled &&
										onClickCell(item.date, "afternoon")
									}
								>
									{getCellContent(item.date, item.afternoon)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{!isManager && status === "접수중" ? (
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
			) : (
				<div className="flex justify-center">
					<span className="text-red">봉사 신청 기간이 아닙니다.</span>
				</div>
			)}
		</div>
	);
}

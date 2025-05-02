import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekCalendarProps {
	startDate: Date;
	canGoPrevious: boolean;
	canGoNext: boolean;
	onPreviousClick: () => void;
	onNextClick: () => void;
	onDateClick: (date: Date) => void;
}

export default function WeekCalendar({
	startDate,
	canGoPrevious,
	canGoNext,
	onPreviousClick,
	onNextClick,
	onDateClick,
}: WeekCalendarProps) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

	const getWeekDates = (start: Date) => {
		const dates: Date[] = [];
		const current = new Date(start);
		for (let i = 0; i < 7; i++) {
			dates.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		return dates;
	};

	const weekDates = getWeekDates(startDate);

	const handleDateClick = (date: Date) => {
		onDateClick(date);
		setSelectedDate(date);
	};

	return (
		<div className="flex items-center justify-center gap-2">
			{/* 이전 주 버튼 */}
			<div className="w-6 h-6 flex items-center">
				{canGoPrevious ? (
					<button
						type="button"
						onClick={onPreviousClick}
						className="text-male hover:text-blue"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
				) : null}
			</div>

			{/* 요일 및 날짜 표시 */}
			<div
				className={
					"flex gap-2 transition-transform duration-300 ease-in-out justify-center"
				}
			>
				{weekDates.map((date, index) => {
					const isSelected =
						selectedDate &&
						date.getDate() === selectedDate.getDate() &&
						date.getMonth() === selectedDate.getMonth() &&
						date.getFullYear() === selectedDate.getFullYear();

					return (
						<button
							type="button"
							key={date.toISOString()}
							onClick={() => handleDateClick(date)}
							aria-label={`${date.getDate()}일 선택`}
							className={`flex flex-col items-center gap-2 w-10 h-16 justify-center rounded-full relative ${
								isSelected
									? "bg-main text-white"
									: "bg-transparent text-grayText hover:bg-superLightGray"
							}`}
						>
							<span className="text-xs">{daysOfWeek[index]}</span>
							<span className="text-sm font-semibold">
								{date.getDate()}
							</span>
						</button>
					);
				})}
			</div>

			{/* 다음 주 버튼 */}
			<div className="w-6 h-6 flex items-center">
				{canGoNext ? (
					<button
						type="button"
						onClick={onNextClick}
						className="text-male hover:text-blue"
					>
						<ChevronRight className="w-6 h-6" />
					</button>
				) : null}
			</div>
		</div>
	);
}

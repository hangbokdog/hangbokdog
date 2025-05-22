import { useEffect, useState } from "react";
import ComboBox from "@/components/ui/comboBox";
import WeekCalendar from "@/components/common/WeekCalendar";
import { useSwipeable } from "react-swipeable";
import VolunteerRequestSection from "./VolunteerRequestSection";

const dateRanges = [
	{
		value: "04.30 - 05.06",
		label: "04.30 - 05.06",
		startDate: new Date("2025-04-30"),
		endDate: new Date("2025-05-06"),
	},
	{
		value: "05.14 - 05.20",
		label: "05.14 - 05.20",
		startDate: new Date("2025-05-14"),
		endDate: new Date("2025-05-20"),
	},
];

export default function VolunteerRequests() {
	const [selectedRange, setSelectedRange] = useState(dateRanges[0]);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const defaultText = "봉사 일정이 없습니다.";

	useEffect(() => {
		if (dateRanges.length !== 0) {
			setSelectedRange(dateRanges[0]);
		}
	}, []);

	const handleComboBoxSelect = (selectedValue: string) => {
		const range = dateRanges.find((r) => r.value === selectedValue);
		if (range) {
			setSelectedRange(range);
		}
	};

	const previousRange = dateRanges
		.filter(
			(range) =>
				range.startDate.getTime() < selectedRange.startDate.getTime(),
		)
		.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

	const canGoPrevious = !!previousRange;

	const nextRange = dateRanges
		.filter(
			(range) =>
				range.startDate.getTime() > selectedRange.startDate.getTime(),
		)
		.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];

	const canGoNext = !!nextRange;

	const goToPreviousWeek = () => {
		if (!canGoPrevious || !previousRange) return;
		setSelectedRange(previousRange);
	};

	const goToNextWeek = () => {
		if (!canGoNext || !nextRange) return;
		setSelectedRange(nextRange);
	};

	const handlers = useSwipeable({
		onSwipedLeft: () => canGoNext && goToNextWeek(),
		onSwipedRight: () => canGoPrevious && goToPreviousWeek(),
		trackMouse: true,
	});

	const onDateClick = (date: Date) => {
		setSelectedDate(date);
	};

	useEffect(() => {});

	return (
		<div className="flex flex-col gap-3 text-grayText">
			<div className="flex gap-2 text-base font-bold">{"신청 대기"}</div>
			<ComboBox
				items={dateRanges}
				defaultText={defaultText}
				selectedValue={selectedRange.value}
				onSelect={handleComboBoxSelect}
			/>
			<div {...handlers}>
				<WeekCalendar
					startDate={selectedRange.startDate}
					canGoPrevious={canGoPrevious}
					canGoNext={canGoNext}
					onPreviousClick={goToPreviousWeek}
					onNextClick={goToNextWeek}
					onDateClick={onDateClick}
				/>
			</div>
			<div>
				<VolunteerRequestSection
					selectedDate={selectedDate || undefined}
				/>
			</div>
		</div>
	);
}

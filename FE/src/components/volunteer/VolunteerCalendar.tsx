import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import koLocale from "@fullcalendar/core/locales/ko";
import type { EventContentArg } from "@fullcalendar/core";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface CalendarEvent {
	title: string;
	start: string;
	end: string;
	backgroundColor: string;
	borderColor: string;
	textColor: string;
	display: string;
}

interface VolunteerCalendarProps {
	events: CalendarEvent[];
}

export default function VolunteerCalendar({ events }: VolunteerCalendarProps) {
	const calendarRef = useRef<FullCalendar>(null);
	const [currentDate, setCurrentDate] = useState(() => new Date());

	const updateCalendarDate = (date: Date) => {
		const calendarApi = calendarRef.current?.getApi();
		if (calendarApi) {
			calendarApi.gotoDate(date);
			setCurrentDate(date);
		}
	};

	const handlePrevMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		updateCalendarDate(newDate);
	};

	const handleNextMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		updateCalendarDate(newDate);
	};

	useEffect(() => {
		const calendarApi = calendarRef.current?.getApi();
		if (calendarApi) {
			const today = new Date();
			calendarApi.gotoDate(today);
			setCurrentDate(today);
		}
	}, []);

	const renderEventContent = (eventContent: EventContentArg) => (
		<div className="w-full h-full flex items-center justify-center">
			<span className="text-xs font-medium">
				{eventContent.event.title}
			</span>
		</div>
	);

	return (
		<div className="flex flex-col gap-2.5">
			<span className="text-xl font-bold">전체 봉사활동 일정</span>
			<div className="bg-white rounded-[8px] p-4 shadow-custom-sm">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold">
							{currentDate.toLocaleString("ko-KR", {
								month: "long",
							})}
						</span>
						<span className="text-lg">
							{currentDate.getFullYear()}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handlePrevMonth}
							className="p-2 hover:bg-gray-100 rounded-lg"
							aria-label="이전 달"
						>
							<MdChevronLeft size={24} />
						</button>
						<button
							type="button"
							onClick={handleNextMonth}
							className="p-2 hover:bg-gray-100 rounded-lg"
							aria-label="다음 달"
						>
							<MdChevronRight size={24} />
						</button>
					</div>
				</div>
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					initialDate="2025-05-01"
					locale={koLocale}
					events={events}
					headerToolbar={false}
					height="auto"
					eventContent={renderEventContent}
					dayHeaderFormat={{ weekday: "short" }}
					fixedWeekCount={false}
					dayCellContent={({ date }) => {
						const today = new Date();
						const isToday =
							date.getDate() === today.getDate() &&
							date.getMonth() === today.getMonth() &&
							date.getFullYear() === today.getFullYear();

						return {
							html: `<div class="w-6 h-6 flex items-center justify-center ${
								isToday
									? "rounded-full bg-primary text-white"
									: ""
							}">${date.getDate().toString()}</div>`,
						};
					}}
					datesSet={(dateInfo) => {
						setCurrentDate(dateInfo.start);
					}}
				/>
			</div>
		</div>
	);
}

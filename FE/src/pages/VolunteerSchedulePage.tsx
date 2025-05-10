import { useMemo } from "react";
import VolunteerCalendar from "@/components/volunteer/VolunteerCalendar";
import OngoingVolunteer from "@/components/volunteer/OngoingVolunteer";
import {
	getClosedVolunteerAPI,
	getVolunteerScheduleAPI,
} from "@/api/volunteer";
import { useQuery } from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import ClosedVolunteer from "@/components/volunteer/ClosedVolunteer";
import {
	CalendarSkeleton,
	OngoingVolunteerSkeleton,
	ClosedVolunteerSkeleton,
} from "@/components/volunteer/SkeletonComponents";
import EmptyState from "@/components/common/EmptyState";

const CALENDAR_COLORS = [
	{ bg: "#F3A68B", border: "#F3A68B" },
	{ bg: "#FFEDB4", border: "#FFEDB4" },
	{ bg: "#8BD4F4", border: "#8BD4F4" },
];

const truncateTitle = (title: string, maxLength: number) => {
	return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

export default function VolunteerSchedulePage() {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

	const { data: volunteers, isLoading: isVolunteersLoading } = useQuery({
		queryKey: ["volunteers", "schedule", centerId],
		queryFn: () =>
			getVolunteerScheduleAPI({ centerId: centerId as string }),
		enabled: !!centerId,
	});

	const { data: closedVolunteers, isLoading: isClosedVolunteersLoading } =
		useQuery({
			queryKey: ["volunteers", "closed", centerId],
			queryFn: () =>
				getClosedVolunteerAPI({ centerId: centerId as string }),
			enabled: !!centerId,
		});

	const calendarEvents = useMemo(() => {
		if (!volunteers) return [];

		return volunteers.map((volunteer, index) => {
			const colorIndex = index % CALENDAR_COLORS.length;
			const color = CALENDAR_COLORS[colorIndex];

			const isOneDay = volunteer.startDate === volunteer.endDate;
			const maxLength = isOneDay ? 3 : 10;

			return {
				id: volunteer.id,
				title: truncateTitle(volunteer.title, maxLength),
				start: volunteer.startDate,
				end: volunteer.endDate,
				backgroundColor: color.bg,
				borderColor: color.border,
				textColor: "#000000",
				display: "block",
			};
		});
	}, [volunteers]);

	return (
		<div className="flex flex-col mx-2.5 gap-6 mt-2.5">
			{isVolunteersLoading ? (
				<CalendarSkeleton />
			) : (
				<VolunteerCalendar events={calendarEvents} />
			)}

			{isVolunteersLoading ? (
				<OngoingVolunteerSkeleton />
			) : volunteers && volunteers.length > 0 ? (
				<OngoingVolunteer volunteers={volunteers} />
			) : (
				<div className="flex flex-col">
					<span className="text-xl font-bold mb-2.5">
						진행 중인 봉사활동
					</span>
					<EmptyState message="진행 중인 봉사활동이 없습니다." />
				</div>
			)}

			{isClosedVolunteersLoading ? (
				<ClosedVolunteerSkeleton />
			) : closedVolunteers?.data && closedVolunteers.data.length > 0 ? (
				<ClosedVolunteer volunteers={closedVolunteers.data} />
			) : (
				<div className="flex flex-col">
					<span className="text-xl font-bold mb-2.5">
						최근 마감된 봉사활동
					</span>
					<EmptyState message="최근 마감된 봉사활동이 없습니다." />
				</div>
			)}
		</div>
	);
}

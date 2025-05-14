import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ActivityLog from "@/components/volunteer/ActivityLog";
import TabsHeader from "@/components/volunteer/TabsHeader";
import ImageCarousel from "@/components/volunteer/ImageCarousel";
import VolunteerInfoHeader from "@/components/volunteer/VolunteerInfoHeader";
import ScheduleTable from "@/components/volunteer/ScheduleTable";
import GuideContent from "@/components/volunteer/GuideContent";
import CautionContent from "@/components/volunteer/CautionContent";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getVolunteerDetailAPI } from "@/api/volunteer";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ApplicationStatusCard from "@/components/volunteer/ApplicationStatusCard";

// 날짜를 YYYY.MM.DD(요일) 형식으로 변환하는 함수
const formatDateWithDay = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "yyyy.MM.dd(E)", { locale: ko });
};

// 신청정보 날짜를 MM.DD(요일) 형식으로 변환하는 함수
const formatApplicationDate = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "M.dd(E)", { locale: ko });
};

export default function VolunteerDetailPage() {
	const { id } = useParams();

	const { data: volunteerDetail, isLoading } = useQuery({
		queryKey: ["volunteerDetail", id],
		queryFn: () => getVolunteerDetailAPI({ eventId: id as string }),
		enabled: !!id,
	});

	// 로딩 중일 때 표시할 내용
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				로딩 중...
			</div>
		);
	}

	// 데이터가 없을 때 표시할 내용
	if (!volunteerDetail) {
		return (
			<div className="flex items-center justify-center h-screen">
				봉사 정보를 찾을 수 없습니다.
			</div>
		);
	}

	// 시간대 정보 생성 (오전 10:00 ~ 14:00 / 오후 15:00 ~ 18:00)
	const timeInfo = volunteerDetail.slots
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		.map((slot: any) => {
			const timeType = slot.slotType === "MORNING" ? "오전" : "오후";
			const startTime = slot.startTime.substring(0, 5);
			const endTime = slot.endTime.substring(0, 5);
			return `${timeType} ${startTime} ~ ${endTime}`;
		})
		.join(" / ");

	// 날짜 범위 정보 생성 (2025.04.14(월) ~ 2025.04.20(일))
	const dateRange = `${formatDateWithDay(volunteerDetail.startDate)} ~ ${formatDateWithDay(volunteerDetail.endDate)}`;

	// 상태 표시 (OPEN, CLOSED 등)
	const statusMap: Record<string, string> = {
		OPEN: "접수중",
		CLOSED: "마감",
		COMPLETED: "완료",
	};

	const status = statusMap[volunteerDetail.status] || "접수중";

	// 신청 정보를 ScheduleTable에 맞게 변환
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const scheduleData = volunteerDetail.applicationInfo.map((info: any) => {
		return {
			date: formatApplicationDate(info.date),
			morning: `${info.morning.appliedCount}/${info.morning.capacity}`,
			afternoon: `${info.afternoon.appliedCount}/${info.afternoon.capacity}`,
		};
	});

	// 사용자 신청 상태 (예시로 넣었습니다. 실제로는 API에서 받아오는 값 사용)
	// 실제 구현시 API 응답에서 applicationStatus 필드를 가져와야 합니다
	const applicationStatus = volunteerDetail.applicationStatus || "PENDING";
	// 참여일/시간 정보 (예시)
	const applicationDate =
		volunteerDetail.applicationDate || volunteerDetail.startDate;
	const applicationTime =
		volunteerDetail.applicationTime || timeInfo.split(" / ")[0];

	return (
		<div className="flex flex-col mt-2.5">
			<ImageCarousel images={volunteerDetail.imageUrls} />
			<div className="flex flex-col p-2.5 gap-2.5">
				{/* 신청 상태가 있을 경우 상태 카드 표시 */}
				{applicationStatus && applicationStatus !== "NONE" && (
					<ApplicationStatusCard
						status={applicationStatus as "PENDING" | "APPROVED"}
						date={formatDateWithDay(applicationDate)}
						time={applicationTime}
					/>
				)}

				<VolunteerInfoHeader
					title={volunteerDetail.title}
					status={status}
					date={dateRange}
					location={volunteerDetail.addressName}
					time={timeInfo}
					pets={volunteerDetail.content || ""}
				/>
				<Tabs
					defaultValue="activity"
					className="w-full bg-white shadow-custom-sm p-2.5 rounded-[8px]"
				>
					<TabsList className="w-full p-0 bg-transparent">
						<TabsHeader value="activity" title="활동 일지" />
						<TabsHeader value="apply" title="봉사 신청" />
						<TabsHeader value="guide" title="봉사 안내" />
						<TabsHeader value="caution" title="주의 사항" />
					</TabsList>
					<TabsContent value="activity" className="mt-2.5">
						<ActivityLog content={volunteerDetail.activityLog} />
					</TabsContent>
					<TabsContent value="apply" className="mt-2.5">
						<ScheduleTable scheduleData={scheduleData} />
					</TabsContent>
					<TabsContent value="guide" className="mt-2.5">
						<GuideContent content={volunteerDetail.info} />
					</TabsContent>
					<TabsContent value="caution" className="mt-2.5">
						<CautionContent content={volunteerDetail.precaution} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

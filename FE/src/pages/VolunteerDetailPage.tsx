import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PostContentItem from "@/components/common/PostContentItem";
import TabsHeader from "@/components/volunteer/TabsHeader";
import ImageCarousel from "@/components/volunteer/ImageCarousel";
import VolunteerInfoHeader from "@/components/volunteer/VolunteerInfoHeader";
import ScheduleTable from "@/components/volunteer/ScheduleTable";
import GuideContent from "@/components/volunteer/GuideContent";
import CautionContent from "@/components/volunteer/CautionContent";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getVolunteerDetailAPI } from "@/api/volunteer";
import { format, parseISO, eachDayOfInterval } from "date-fns";
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

interface Slot {
	id: number;
	slotType: "MORNING" | "AFTERNOON";
	startTime: string;
	endTime: string;
	volunteerDate: string;
	capacity: number;
	applicationCount: number;
}

export default function VolunteerDetailPage() {
	const { id } = useParams();

	const { data: volunteerDetail, isLoading } = useQuery({
		queryKey: ["volunteerDetail", id],
		queryFn: () => getVolunteerDetailAPI({ eventId: id as string }),
		enabled: !!id,
	});

	console.log(volunteerDetail);

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

	// 첫 번째 오전과 오후 슬롯을 가져와 시간대 정보 생성
	const morningSlot = volunteerDetail.slots.find(
		(slot: Slot) => slot.slotType === "MORNING",
	);
	const afternoonSlot = volunteerDetail.slots.find(
		(slot: Slot) => slot.slotType === "AFTERNOON",
	);

	// 시간대 정보 생성 (오전 10:00 ~ 14:00 / 오후 15:00 ~ 18:00)
	let timeInfo = "";
	if (morningSlot) {
		timeInfo += `오전 ${morningSlot.startTime.substring(0, 5)} ~ ${morningSlot.endTime.substring(0, 5)}`;
	}
	if (afternoonSlot) {
		timeInfo += timeInfo ? " / " : "";
		timeInfo += `오후 ${afternoonSlot.startTime.substring(0, 5)} ~ ${afternoonSlot.endTime.substring(0, 5)}`;
	}

	// 날짜 범위 정보 생성 (2025.04.14(월) ~ 2025.04.20(일))
	const dateRange = `${formatDateWithDay(volunteerDetail.startDate)} ~ ${formatDateWithDay(volunteerDetail.endDate)}`;

	// 상태 표시 (OPEN, CLOSED 등)
	const statusMap: Record<string, string> = {
		OPEN: "접수중",
		CLOSED: "마감",
		COMPLETED: "완료",
	};

	const status = statusMap[volunteerDetail.status] || "접수중";

	// 시작일부터 종료일까지의 모든 날짜 구하기
	const startDate = parseISO(volunteerDetail.startDate);
	const endDate = parseISO(volunteerDetail.endDate);

	// 시작일부터 종료일까지의 모든 날짜 배열 생성
	const allDates = eachDayOfInterval({ start: startDate, end: endDate });

	// 날짜별로 슬롯을 그룹화하기 위한 객체 생성
	const slotsByDate: Record<
		string,
		{ morning: Slot | null; afternoon: Slot | null }
	> = {};

	// 모든 날짜에 대한 기본 슬롯 정보 초기화
	for (const date of allDates) {
		const dateStr = format(date, "yyyy-MM-dd");
		slotsByDate[dateStr] = {
			morning: null,
			afternoon: null,
		};
	}

	// volunteerDate를 기준으로 슬롯 그룹화
	for (const slot of volunteerDetail.slots) {
		if (slot.volunteerDate) {
			if (slot.slotType === "MORNING") {
				slotsByDate[slot.volunteerDate].morning = slot;
			} else if (slot.slotType === "AFTERNOON") {
				slotsByDate[slot.volunteerDate].afternoon = slot;
			}
		}
	}

	// 스케줄 데이터 생성
	const scheduleData = [];
	for (const date of allDates) {
		const dateStr = format(date, "yyyy-MM-dd");
		const slots = slotsByDate[dateStr];

		scheduleData.push({
			date: formatApplicationDate(dateStr),
			morning: `${slots.morning?.applicationCount || 0}/${slots.morning?.capacity || 0}`,
			afternoon: `${slots.afternoon?.applicationCount || 0}/${slots.afternoon?.capacity || 0}`,
		});
	}

	// 사용자 신청 상태 (예시로 넣었습니다. 실제로는 API에서 받아오는 값 사용)
	const applicationStatus = volunteerDetail.applicationStatus || "NONE";
	// 참여일/시간 정보 (예시)
	const applicationDate =
		volunteerDetail.applicationDate || volunteerDetail.startDate;
	const applicationTime =
		volunteerDetail.applicationTime || (morningSlot ? "오전" : "오후");

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
						<PostContentItem
							content={volunteerDetail.activityLog}
						/>
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

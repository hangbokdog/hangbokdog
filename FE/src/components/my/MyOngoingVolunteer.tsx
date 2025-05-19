import { useParams } from "react-router-dom";
import { useMyVolunteerApplications } from "@/lib/hooks/useMyVolunteerApplications";
import OngoingVolunteer from "@/components/volunteer/OngoingVolunteer";
import type { Volunteer } from "@/types/volunteer";

export default function MyOngoingVolunteer() {
	// useParams는 항상 string으로 반환되므로 string → number 변환 필요
	const params = useParams();
	const eventIdParam = params.eventId;

	// 숫자 변환 및 유효성 검사
	const eventId = Number(eventIdParam);
	const isValidEventId = !!eventIdParam && !Number.isNaN(eventId);

	console.log("eventId 존재: ", eventId);
	if (!isValidEventId) {
		return <div>잘못된 접근입니다. eventId가 유효하지 않습니다.</div>;
	}

	// Tanstack Query 호출
	const { data, isLoading, error } = useMyVolunteerApplications(eventId); // ✅ number로 전달

	if (isLoading) return <div>불러오는 중...</div>;
	if (error || !data) return <div>신청 내역을 불러오지 못했습니다.</div>;

	// 응답 데이터 가공 → Volunteer[]
	const appliedVolunteers: Volunteer[] = data.flatMap((item) =>
		item.applications.map((app) => ({
			id: app.volunteer.id,
			title: app.volunteer.title,
			content: app.volunteer.content,
			address: app.volunteer.addressName,
			locationType: "센터",
			startDate: app.volunteer.startDate,
			endDate: app.volunteer.endDate,
			imageUrl: app.volunteer.imageUrls?.[0] || "/placeholder.svg",
		})),
	);

	return <OngoingVolunteer volunteers={appliedVolunteers} />;
}

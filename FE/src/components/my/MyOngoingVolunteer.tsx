import { useParams } from "react-router-dom";
import { useMyVolunteerApplications } from "@/lib/hooks/useMyVolunteerApplications";
import OngoingVolunteer from "@/components/volunteer/OngoingVolunteer";
import type { Volunteer } from "@/types/volunteer";

export default function MyOngoingVolunteer() {
	const { eventId } = useParams<{ eventId: string }>();

	// ✅ eventId 유효성 체크 및 숫자 변환
	const numericEventId = Number(eventId);
	if (!eventId || Number.isNaN(numericEventId)) {
		return <div>잘못된 접근입니다. eventId가 유효하지 않습니다.</div>;
	}

	const { data, isLoading, error } =
		useMyVolunteerApplications(numericEventId); // ✅ number 타입으로 넘김

	if (isLoading) return <div>불러오는 중...</div>;
	if (error || !data) return <div>신청 내역을 불러오지 못했습니다.</div>;

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

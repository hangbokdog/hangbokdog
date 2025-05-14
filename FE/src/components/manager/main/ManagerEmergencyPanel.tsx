import ListPanel from "@/components/common/ListPanel";
import MovingListItem from "@/components/common/emergency/movingListItem";
import DonationListItem from "@/components/common/emergency/donationListItem";
import VolunteerListItem from "@/components/common/emergency/volunteerListItem";
import { useQuery } from "@tanstack/react-query";
import { getEmergencyPostAPI } from "@/api/emergencyRegister";
import { EmergencyType } from "@/types/emergencyRegister";

interface EmergencyPanelProps {
	centerId: number;
}

export default function ManagerEmergencyPanel({
	centerId,
}: EmergencyPanelProps) {
	// ✅ 일손 게시글
	const { data: volunteerPosts = [], isLoading: isLoadingVolunteer } =
		useQuery({
			queryKey: ["emergency-posts", centerId, EmergencyType.VOLUNTEER],
			queryFn: () =>
				getEmergencyPostAPI(centerId, EmergencyType.VOLUNTEER),
			enabled: !!centerId,
			refetchOnMount: true,
			staleTime: 0,
		});

	console.log("volunteerPosts(raw):", volunteerPosts);

	// ✅ 이동 게시글
	const { data: transportPosts = [], isLoading: isLoadingTransport } =
		useQuery({
			queryKey: ["emergency-posts", centerId, EmergencyType.TRANSPORT],
			queryFn: () =>
				getEmergencyPostAPI(centerId, EmergencyType.TRANSPORT),
			enabled: !!centerId,
			refetchOnMount: true,
			staleTime: 0,
		});

	// ✅ 후원 게시글
	const { data: donationPosts = [], isLoading: isLoadingDonation } = useQuery(
		{
			queryKey: ["emergency-posts", centerId, EmergencyType.DONATION],
			queryFn: () =>
				getEmergencyPostAPI(centerId, EmergencyType.DONATION),
			enabled: !!centerId,
			refetchOnMount: true,
			staleTime: 0,
		},
	);

	// ✅ 전체 로딩 처리
	if (isLoadingVolunteer || isLoadingTransport || isLoadingDonation) {
		return <div>불러오는 중...</div>;
	}

	return (
		<ListPanel
			link="/manager/emergency"
			tabs={[
				{
					key: "volunteer",
					label: "일손",
					data: volunteerPosts.map((p, idx) => ({
						title: p.title,
						target: p.capacity ?? 0,
						date: `D-${calculateDDay(p.dueDate)}`,
						index: idx,
					})),
					component: VolunteerListItem,
				},
				{
					key: "transport",
					label: "이동",
					data: transportPosts.map((p, idx) => ({
						title: p.title,
						name: p.name,
						date: `D-${calculateDDay(p.dueDate)}`,
						index: idx,
					})),
					component: MovingListItem,
				},
				{
					key: "donation",
					label: "후원",
					data: donationPosts.map((p, idx) => ({
						title: p.title,
						current: 0,
						target: p.targetAmount ?? 0,
						date: `D-${calculateDDay(p.dueDate)}`,
						index: idx,
					})),
					component: DonationListItem,
				},
			]}
		/>
	);
}

function calculateDDay(dueDate: string): number {
	const today = new Date();
	const due = new Date(dueDate);
	const diff = due.getTime() - today.getTime();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

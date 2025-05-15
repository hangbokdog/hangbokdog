import { useState } from "react";
import ListPanel from "@/components/common/ListPanel";
import MovingListItem from "@/components/common/emergency/movingListItem";
import DonationListItem from "@/components/common/emergency/donationListItem";
import VolunteerListItem from "@/components/common/emergency/volunteerListItem";
import EmergencyDetailModal from "@/components/common/emergency/EmergencyDetailModal";
import { useQuery } from "@tanstack/react-query";
import { getEmergencyPostAPI } from "@/api/emergencyRegister";
import { EmergencyType, type EmergencyPost } from "@/types/emergencyRegister";

interface EmergencyPanelProps {
	centerId: number;
}

export default function ManagerEmergencyPanel({
	centerId,
}: EmergencyPanelProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [open, setOpen] = useState(false);

	const { data: volunteerPosts = [], isLoading: isLoadingVolunteer } =
		useQuery({
			queryKey: ["emergency-posts", centerId, EmergencyType.VOLUNTEER],
			queryFn: () =>
				getEmergencyPostAPI(centerId, EmergencyType.VOLUNTEER),
			enabled: !!centerId,
			refetchOnMount: true,
			staleTime: 0,
		});

	const { data: transportPosts = [], isLoading: isLoadingTransport } =
		useQuery({
			queryKey: ["emergency-posts", centerId, EmergencyType.TRANSPORT],
			queryFn: () =>
				getEmergencyPostAPI(centerId, EmergencyType.TRANSPORT),
			enabled: !!centerId,
			refetchOnMount: true,
			staleTime: 0,
		});

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

	if (isLoadingVolunteer || isLoadingTransport || isLoadingDonation) {
		return <div>불러오는 중...</div>;
	}

	const allPosts: EmergencyPost[] = [
		...volunteerPosts,
		...transportPosts,
		...donationPosts,
	];
	const selectedPost =
		allPosts.find((p) => p.emergencyId === selectedId) ?? null;

	return (
		<div className="flex flex-col">
			<ListPanel
				link="/manager/emergency"
				tabs={[
					{
						key: "volunteer",
						label: "일손",
						data: volunteerPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							target: p.capacity ?? 0,
							date: `D-${calculateDDay(p.dueDate)}`,
							index: idx,
							emergencyId: p.emergencyId,
							onClick: () => {
								setSelectedId(p.emergencyId);
								setOpen(true);
							},
						})),
						component: VolunteerListItem,
					},
					{
						key: "transport",
						label: "이동",
						data: transportPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							date: `D-${calculateDDay(p.dueDate)}`,
							index: idx,
							emergencyId: p.emergencyId,
							onClick: () => {
								setSelectedId(p.emergencyId);
								setOpen(true);
							},
						})),
						component: MovingListItem,
					},
					{
						key: "donation",
						label: "후원",
						data: donationPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							target: p.targetAmount ?? 0,
							date: `D-${calculateDDay(p.dueDate)}`,
							index: idx,
							emergencyId: p.emergencyId,
							onClick: () => {
								setSelectedId(p.emergencyId);
								setOpen(true);
							},
						})),
						component: DonationListItem,
					},
				]}
			/>

			{selectedPost && (
				<EmergencyDetailModal
					data={selectedPost}
					open={open}
					onClose={() => {
						setOpen(false);
						setSelectedId(null);
					}}
				/>
			)}
		</div>
	);
}

function calculateDDay(dueDate: string): number {
	const today = new Date();
	const due = new Date(dueDate);
	const diff = due.getTime() - today.getTime();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

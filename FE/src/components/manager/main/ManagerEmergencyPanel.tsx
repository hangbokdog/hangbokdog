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
	isHome?: boolean;
}

export default function ManagerEmergencyPanel({
	centerId,
	isHome,
}: EmergencyPanelProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [open, setOpen] = useState(false);

	const {
		data: volunteerData = { posts: [], count: 0 },
		isLoading: isLoadingVolunteer,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			centerId,
			EmergencyType.VOLUNTEER,
			{ isHome },
		],
		queryFn: () =>
			getEmergencyPostAPI(centerId, EmergencyType.VOLUNTEER, { isHome }),
		enabled: !!centerId,
		refetchOnMount: true,
		staleTime: 0,
	});
	const volunteerPosts = volunteerData.posts;
	const volunteerCount = volunteerData.count;

	const {
		data: transportData = { posts: [], count: 0 },
		isLoading: isLoadingTransport,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			centerId,
			EmergencyType.TRANSPORT,
			{ isHome },
		],
		queryFn: () =>
			getEmergencyPostAPI(centerId, EmergencyType.TRANSPORT, { isHome }),
		enabled: !!centerId,
		refetchOnMount: true,
		staleTime: 0,
	});
	const transportPosts = transportData.posts;
	const transportCount = transportData.count;

	const {
		data: donationData = { posts: [], count: 0 },
		isLoading: isLoadingDonation,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			centerId,
			EmergencyType.DONATION,
			{ isHome },
		],
		queryFn: () =>
			getEmergencyPostAPI(centerId, EmergencyType.DONATION, { isHome }),
		enabled: !!centerId,
		refetchOnMount: true,
		staleTime: 0,
	});
	const donationPosts = donationData.posts;
	const donationCount = donationData.count;

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
				link="/emergency"
				tabs={[
					{
						key: "volunteer",
						label: `일손 (${volunteerCount})`,
						data: volunteerPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							target: p.capacity ?? 0,
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
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
						label: `이동 (${transportCount})`,
						data: transportPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
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
						label: `후원 (${donationCount})`,
						data: donationPosts.map((p, idx) => ({
							title: p.title,
							name: p.name ?? "알 수 없음",
							target: p.targetAmount ?? 0,
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
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

function DdayTag({ dday }: { dday: number }) {
	const label = `D-${dday}`;
	let colorClass = "bg-gray-100 text-gray-600";

	if (dday <= 1) {
		colorClass = "bg-red-100 text-red-600 animate-pulse";
	} else if (dday <= 3) {
		colorClass = "bg-orange-100 text-orange-600";
	} else if (dday <= 7) {
		colorClass = "bg-yellow-100 text-yellow-600";
	}

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
		>
			{label}
		</span>
	);
}

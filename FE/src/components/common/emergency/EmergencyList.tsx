import { useState } from "react";
import ListPanel from "@/components/common/ListPanel";
import EmergencyListItem from "@/components/common/emergency/EmergencyListItem";
import EmergencyDetailModal from "@/components/common/emergency/EmergencyDetailModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmergencyPostAPI } from "@/api/emergencyRegister";
import { EmergencyType, type EmergencyPost } from "@/types/emergencyRegister";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";
import { deleteEmergencyAPI } from "@/api/emergency";

export default function EmergencyList() {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const queryClient = useQueryClient();
	const { selectedCenter } = useCenterStore();

	const {
		data: volunteerData = { posts: [], count: 0 },
		isLoading: isLoadingVolunteer,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			selectedCenter?.centerId,
			EmergencyType.VOLUNTEER,
		],
		queryFn: () =>
			getEmergencyPostAPI(
				Number(selectedCenter?.centerId),
				EmergencyType.VOLUNTEER,
				{ isHome: false },
			),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	const {
		data: transportData = { posts: [], count: 0 },
		isLoading: isLoadingTransport,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			selectedCenter?.centerId,
			EmergencyType.TRANSPORT,
		],
		queryFn: () =>
			getEmergencyPostAPI(
				Number(selectedCenter?.centerId),
				EmergencyType.TRANSPORT,
				{ isHome: false },
			),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	const {
		data: donationData = { posts: [], count: 0 },
		isLoading: isLoadingDonation,
	} = useQuery({
		queryKey: [
			"emergency-posts",
			selectedCenter?.centerId,
			EmergencyType.DONATION,
		],
		queryFn: () =>
			getEmergencyPostAPI(
				Number(selectedCenter?.centerId),
				EmergencyType.DONATION,
				{ isHome: false },
			),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { mutate: deletePost } = useMutation({
		mutationFn: (emergencyId: number) =>
			deleteEmergencyAPI(emergencyId, Number(selectedCenter?.centerId)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["emergency-posts"] });
			toast.success("긴급 요청이 삭제되었습니다.");
		},
		onError: () => {
			toast.error("긴급 요청 삭제 중 오류가 발생했습니다.");
		},
	});

	const handleDelete = (emergencyId: number) => {
		deletePost(emergencyId);
	};

	if (isLoadingVolunteer || isLoadingTransport || isLoadingDonation) {
		return <div>불러오는 중...</div>;
	}

	const allPosts: EmergencyPost[] = [
		...volunteerData.posts,
		...transportData.posts,
		...donationData.posts,
	];
	const selectedPost =
		allPosts.find((p) => p.emergencyId === selectedId) ?? null;

	const handleItemClick = (emergencyId: number) => {
		setSelectedId(emergencyId);
		setOpen(true);
	};

	const handleExpand = (emergencyId: number) => {
		setExpandedId(expandedId === emergencyId ? null : emergencyId);
	};

	return (
		<div className="flex flex-col">
			<ListPanel
				tabs={[
					{
						key: "volunteer",
						label: `일손 (${volunteerData.count})`,
						data: volunteerData.posts.map((p, idx) => ({
							emergencyId: p.emergencyId,
							title: p.title,
							name: p.name ?? "알 수 없음",
							type: EmergencyType.VOLUNTEER,
							target: p.capacity ?? 0,
							current: p.targetAmount ?? 0,
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
							index: idx,
							content: p.content ?? "",
							onClick: handleItemClick,
							expanded: expandedId === p.emergencyId,
							onExpand: handleExpand,
						})),
						component: EmergencyListItem,
					},
					{
						key: "transport",
						label: `이동 (${transportData.count})`,
						data: transportData.posts.map((p, idx) => ({
							emergencyId: p.emergencyId,
							title: p.title,
							name: p.name ?? "알 수 없음",
							type: EmergencyType.TRANSPORT,
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
							index: idx,
							target: 1,
							current: 0,
							content: p.content ?? "",
							onClick: handleItemClick,
							expanded: expandedId === p.emergencyId,
							onExpand: handleExpand,
						})),
						component: EmergencyListItem,
					},
					{
						key: "donation",
						label: `기타 (${donationData.count})`,
						data: donationData.posts.map((p, idx) => ({
							emergencyId: p.emergencyId,
							title: p.title,
							name: p.name ?? "알 수 없음",
							type: EmergencyType.DONATION,
							target: p.targetAmount ?? 0,
							date: <DdayTag dday={calculateDDay(p.dueDate)} />,
							index: idx,
							content: p.content ?? "",
							onClick: handleItemClick,
							expanded: expandedId === p.emergencyId,
							onExpand: handleExpand,
						})),
						component: EmergencyListItem,
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
					onDelete={handleDelete}
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

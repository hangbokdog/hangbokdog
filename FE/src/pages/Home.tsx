import { getLatestDogAPI } from "@/api/dog";
import { getLatestVolunteerAPI } from "@/api/volunteer";
import EmptyState from "@/components/common/EmptyState";
import { DogPanelSkeleton } from "@/components/dog/SkeletonComponents";
import CenterJoinPrompt from "@/components/home/CenterJoinPrompt";
import DogPanel from "@/components/home/DogPanel";
import EmergencyPanel from "@/components/home/EmergencyPanel";
import ManagerDashboardPanel from "@/components/home/ManagerDashboardPanel";
import PostPanel from "@/components/home/PostPanel";
import VolunteerPanel from "@/components/home/VolunteerPanel";
import { VolunteerPanelSkeleton } from "@/components/volunteer/SkeletonComponents";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const { selectedCenter, isCenterMember } = useCenterStore();
	const centerId = selectedCenter?.centerId;
	const isManager = selectedCenter?.status === "MANAGER";

	const { data: volunteers, isLoading: isVolunteersLoading } = useQuery({
		queryKey: ["volunteers", "latest", centerId],
		queryFn: () => getLatestVolunteerAPI({ centerId: centerId as string }),
		enabled: !!centerId,
	});

	const { data: dogs, isLoading: isDogsLoading } = useQuery({
		queryKey: ["dogs", "latest", centerId],
		queryFn: () => getLatestDogAPI(centerId as string),
		enabled: !!centerId,
	});

	return (
		<div className="flex flex-col gap-3 w-full mt-2.5">
			{isManager && <ManagerDashboardPanel />}
			{!isCenterMember && <CenterJoinPrompt />}
			<EmergencyPanel />

			<PostPanel />

			{isVolunteersLoading ? (
				<VolunteerPanelSkeleton />
			) : volunteers && volunteers.length > 0 ? (
				<VolunteerPanel volunteers={volunteers} />
			) : (
				<div className="flex flex-col gap-3 mx-2.5 p-2.5 bg-white rounded-lg shadow-custom-sm">
					<span className="text-xl font-bold">자원봉사 일정</span>
					<EmptyState message="자원봉사 일정이 없습니다." />
				</div>
			)}

			{isDogsLoading ? (
				<DogPanelSkeleton />
			) : dogs && dogs.dogSummaries.length > 0 ? (
				<DogPanel count={dogs.count} dogSummaries={dogs.dogSummaries} />
			) : (
				<div className="flex flex-col gap-3 mx-2.5 p-2.5 bg-white rounded-lg shadow-custom-sm">
					<span className="text-xl font-bold">보호중인 아이들</span>
					<EmptyState message="보호중인 아이들이 없습니다." />
				</div>
			)}
		</div>
	);
}

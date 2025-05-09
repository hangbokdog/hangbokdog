import { getLatestDogAPI } from "@/api/dog";
import { getLatestVolunteerAPI } from "@/api/volunteer";
import EmptyState from "@/components/common/EmptyState";
import { DogPanelSkeleton } from "@/components/dog/SkeletonComponents";
import DogPanel from "@/components/home/DogPanel";
import DonationPanel from "@/components/home/DonationPanel";
import EmergencyPanel from "@/components/home/EmergencyPanel";
import MyDonationPanel from "@/components/home/MyDonationPanel";
import VolunteerPanel from "@/components/home/VolunteerPanel";
import { VolunteerPanelSkeleton } from "@/components/volunteer/SkeletonComponents";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

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
		<div className="flex flex-col gap-3 w-full">
			<EmergencyPanel />

			{isVolunteersLoading ? (
				<VolunteerPanelSkeleton />
			) : volunteers && volunteers.length > 0 ? (
				<VolunteerPanel volunteers={volunteers} />
			) : (
				<div className="flex flex-col">
					<span className="text-xl font-bold mb-2.5">
						자원봉사 일정
					</span>
					<EmptyState message="자원봉사 일정이 없습니다." />
				</div>
			)}

			{isDogsLoading ? (
				<DogPanelSkeleton />
			) : dogs && dogs.dogSummaries.length > 0 ? (
				<DogPanel count={dogs.count} dogSummaries={dogs.dogSummaries} />
			) : (
				<div className="flex flex-col">
					<span className="text-xl font-bold mb-2.5">
						보호중인 아이들
					</span>
					<EmptyState message="보호중인 아이들이 없습니다." />
				</div>
			)}

			<div className="max-w-[420px] mx-2.5 grid grid-cols-2 gap-3 pb-2.5">
				<DonationPanel />
				<MyDonationPanel />
			</div>
		</div>
	);
}

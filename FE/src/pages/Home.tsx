import { getLatestVolunteerAPI } from "@/api/volunteer";
import DogPanel from "@/components/home/DogPanel";
import DonationPanel from "@/components/home/DonationPanel";
import EmergencyPanel from "@/components/home/EmergencyPanel";
import MyDonationPanel from "@/components/home/MyDonationPanel";
import VolunteerPanel from "@/components/home/VolunteerPanel";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

	const { data: volunteers } = useQuery({
		queryKey: ["volunteers", centerId],
		queryFn: () => getLatestVolunteerAPI({ centerId: centerId as string }),
		enabled: !!centerId,
	});

	return (
		<div className="flex flex-col gap-3 w-full">
			<EmergencyPanel />
			<VolunteerPanel volunteers={volunteers ?? []} />
			<DogPanel />
			<div className="max-w-[420px] mx-2.5 grid grid-cols-2 gap-3 pb-2.5">
				<DonationPanel />
				<MyDonationPanel />
			</div>
		</div>
	);
}

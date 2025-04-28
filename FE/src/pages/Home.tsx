import DogPanel from "@/components/home/DogPanel";
import DonationPanel from "@/components/home/DonationPanel";
import EmergencyPanel from "@/components/home/EmergencyPanel";
import MyDonationPanel from "@/components/home/MyDonationPanel";
import VolunteerPanel from "@/components/home/VolunteerPanel";

export default function Home() {
	return (
		<div className="flex flex-col gap-3 w-full">
			<EmergencyPanel />
			<VolunteerPanel />
			<DogPanel />
			<div className="max-w-[382px] grid grid-cols-2 gap-3 pb-2.5">
				<DonationPanel />
				<MyDonationPanel />
			</div>
		</div>
	);
}

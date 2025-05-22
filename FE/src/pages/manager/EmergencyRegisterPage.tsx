import { useState } from "react";
import MovingRegister from "@/components/manager/emergency/register/MovingRegister";
import RegisterTag from "@/components/manager/emergency/register/RegisterTag";
import VolunteerRegister from "@/components/manager/emergency/register/VolunteerRegister";
import DonationRegister from "@/components/manager/emergency/register/DonationRegister";

export default function EmergencyRegisterPage() {
	const [selected, setSelected] = useState<
		"MOVING" | "VOLUNTEER" | "DONATION"
	>("MOVING");

	return (
		<div className="mx-2.5 space-y-2">
			<div className="text-gray-700 mx-2.5 text-lg font-medium">
				긴급 상황
			</div>
			<div className="mx-2.5 flex gap-2">
				{(["MOVING", "VOLUNTEER", "DONATION"] as const).map((type) => (
					<RegisterTag
						key={type}
						register={type}
						selected={selected === type}
						onClick={setSelected}
					/>
				))}
			</div>
			<div className="mt-4">
				{selected === "MOVING" && <MovingRegister />}
				{selected === "VOLUNTEER" && <VolunteerRegister />}
				{selected === "DONATION" && <DonationRegister />}
			</div>
		</div>
	);
}

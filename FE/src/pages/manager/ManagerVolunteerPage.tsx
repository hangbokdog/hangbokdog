import TabPanel from "@/components/common/TabPanel";
import ShimTtleVolunteerPanel from "@/components/manager/volunteer/ShimTtleVolunteerPanel";
import ShimTuhVolunteerPanel from "@/components/manager/volunteer/ShimTuhVolunteerPanel";
import YipYangTtleVolunteerPanel from "@/components/manager/volunteer/YipYangTtleVolunteerPanel";

export default function ManagerVolunteerPage() {
	return (
		<div className="flex flex-col gap-3 text-grayText mx-2.5">
			<div className="text-xl font-bold">봉사</div>
			<TabPanel
				tabs={[
					{
						key: "ShimTtle",
						label: "쉼뜰",
						component: ShimTtleVolunteerPanel,
					},
					{
						key: "ShimTuh",
						label: "쉼터",
						component: ShimTuhVolunteerPanel,
					},
					{
						key: "YipYangTtle",
						label: "입양뜰",
						component: YipYangTtleVolunteerPanel,
					},
				]}
			/>
		</div>
	);
}

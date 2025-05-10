import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ActivityLog from "@/components/volunteer/ActivityLog";
import TabsHeader from "@/components/volunteer/TabsHeader";
import ImageCarousel from "@/components/volunteer/ImageCarousel";
import VolunteerInfoHeader from "@/components/volunteer/VolunteerInfoHeader";
import ScheduleTable from "@/components/volunteer/ScheduleTable";
import GuideContent from "@/components/volunteer/GuideContent";
import CautionContent from "@/components/volunteer/CautionContent";

export default function VolunteerDetailPage() {
	const scheduleData = [
		{ date: "4.14(월)", morning: "1/6", afternoon: "1/6" },
		{ date: "4.15(화)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.16(수)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.17(목)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.18(금)", morning: "1/6", afternoon: "3/6" },
		{ date: "4.19(토)", morning: "4/6", afternoon: "6/6" },
		{ date: "4.20(일)", morning: "6/6", afternoon: "3/6" },
	];

	return (
		<div className="flex flex-col mt-2.5">
			<ImageCarousel />
			<div className="flex flex-col p-2.5 gap-2.5">
				<VolunteerInfoHeader
					title="쉼뜰 봉사"
					status="접수중"
					date="2025.04.14(월) ~ 2025.04.20(일)"
					location="파주 어딘가"
					time="오전 10:00 ~ 14:00 / 오후 15:00 ~ 18:00"
					pets="루체 | 리옹 | 시저가 먹고싶었던 쿠다 | 북청사자놀음"
				/>
				<Tabs
					defaultValue="activity"
					className="w-full bg-white shadow-custom-sm p-2.5 rounded-[8px]"
				>
					<TabsList className="w-full p-0 bg-transparent">
						<TabsHeader value="activity" title="활동 일지" />
						<TabsHeader value="apply" title="봉사 신청" />
						<TabsHeader value="guide" title="봉사 안내" />
						<TabsHeader value="caution" title="주의 사항" />
					</TabsList>
					<TabsContent value="activity" className="mt-2.5">
						<ActivityLog />
					</TabsContent>
					<TabsContent value="apply" className="mt-2.5">
						<ScheduleTable scheduleData={scheduleData} />
					</TabsContent>
					<TabsContent value="guide" className="mt-2.5">
						<GuideContent />
					</TabsContent>
					<TabsContent value="caution" className="mt-2.5">
						<CautionContent />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEmergencyPostAPI } from "@/api/emergencyRegister";
import { EmergencyType } from "@/types/emergencyRegister";
import useCenterStore from "@/lib/store/centerStore";
import { cn } from "@/lib/utils";
import { Truck, Users, Box } from "lucide-react";
import EmergencyDetailModal from "@/components/common/emergency/EmergencyDetailModal";
import MovingListItem from "@/components/common/emergency/movingListItem";
import DonationListItem from "@/components/common/emergency/donationListItem";
import VolunteerListItem from "@/components/common/emergency/volunteerListItem";

type TabType = EmergencyType | "MY";

export default function AllEmergencyPage() {
	const { selectedCenter } = useCenterStore();
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>(
		EmergencyType.VOLUNTEER,
	);

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
			{ isHome: false },
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
			),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	const isLoading =
		isLoadingVolunteer || isLoadingTransport || isLoadingDonation;

	const selectedEmergencyPost =
		activeTab !== "MY"
			? [
					...volunteerData.posts,
					...transportData.posts,
					...donationData.posts,
				].find((p) => p.emergencyId === selectedId)
			: null;

	const tabs = [
		{
			type: EmergencyType.VOLUNTEER as TabType,
			label: "일손",
			icon: Users,
			count: volunteerData.count,
			posts: volunteerData.posts.map((p, idx) => ({
				title: p.title,
				name: p.name ?? "알 수 없음",
				target: p.capacity ?? 0,
				date: <DdayTag dday={calculateDDay(p.dueDate)} />,
				index: idx,
				emergencyId: p.emergencyId,
				img: "",
				current: 0,
				onClick: (emergencyId: number) => {
					setSelectedId(emergencyId);
					setOpen(true);
				},
			})),
			component: VolunteerListItem,
		},
		{
			type: EmergencyType.TRANSPORT as TabType,
			label: "이동",
			icon: Truck,
			count: transportData.count,
			posts: transportData.posts.map((p, idx) => ({
				title: p.title,
				name: p.name ?? "알 수 없음",
				date: <DdayTag dday={calculateDDay(p.dueDate)} />,
				index: idx,
				emergencyId: p.emergencyId,
				img: "",
				current: 0,
				target: 0,
				onClick: (emergencyId: number) => {
					setSelectedId(emergencyId);
					setOpen(true);
				},
			})),
			component: MovingListItem,
		},
		{
			type: EmergencyType.DONATION as TabType,
			label: "기타",
			icon: Box,
			count: donationData.count,
			posts: donationData.posts.map((p, idx) => ({
				title: p.title,
				name: p.name ?? "알 수 없음",
				target: p.targetAmount ?? 0,
				date: <DdayTag dday={calculateDDay(p.dueDate)} />,
				index: idx,
				emergencyId: p.emergencyId,
				img: "",
				current: 0,
				onClick: (emergencyId: number) => {
					setSelectedId(emergencyId);
					setOpen(true);
				},
			})),
			component: DonationListItem,
		},
	];

	const activeTabData = tabs.find((tab) => tab.type === activeTab);

	return (
		<div className="flex flex-col min-h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] overflow-hidden">
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="px-1 pt-2 text-xl font-bold text-gray-800 flex justify-between items-center">
						긴급 요청
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{/* Tab Navigation */}
				<div className="bg-white z-10 border-b border-gray-100">
					<div className="max-w-lg mx-auto px-4">
						<div className="grid grid-cols-4 gap-4 py-3">
							{tabs.map((tab) => (
								<button
									type="button"
									key={tab.type}
									onClick={() => setActiveTab(tab.type)}
									className={cn(
										"col-span-1",
										"flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
										activeTab === tab.type
											? "bg-red-50 text-red-600"
											: "text-gray-600 hover:bg-gray-50",
									)}
								>
									<tab.icon className="w-5 h-5" />
									<div className="flex items-center gap-1">
										<span>{tab.label}</span>
										{tab.count > 0 && (
											<span className="px-1.5 py-0.5 text-xs rounded-full bg-white">
												{tab.count}
											</span>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="max-w-lg mx-auto p-4">
					{isLoading ? (
						<div className="flex items-center justify-center py-8 text-gray-400">
							불러오는 중...
						</div>
					) : activeTabData?.posts.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-gray-400">
							<p className="text-sm">데이터가 없습니다</p>
						</div>
					) : (
						<div className="space-y-0.5">
							{activeTabData?.posts.map((post) => {
								const Component = activeTabData.component;
								return (
									<div
										key={post.emergencyId}
										className="border-b border-gray-100 last:border-b-0"
									>
										<Component {...post} />
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
			{selectedEmergencyPost && (
				<EmergencyDetailModal
					data={selectedEmergencyPost}
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

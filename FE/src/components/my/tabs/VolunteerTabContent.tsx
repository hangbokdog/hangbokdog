import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CalendarCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	fetchAllMyVoluteersAPI,
	type VolunteerApplicationResponse,
} from "@/api/volunteer";
import type { VolunteerApplicationStatus } from "@/types/volunteer";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type VolunteerTabType = "PENDING" | "APPROVED" | "COMPLETED";

interface VolunteerRecordProps {
	id: number;
	date: string;
	title: string;
	startTime: string;
	endTime: string;
	status: VolunteerApplicationStatus;
}

const VolunteerRecord = ({
	id,
	date,
	title,
	startTime,
	endTime,
	status,
}: VolunteerRecordProps) => {
	const getStatusIcon = () => {
		switch (status) {
			case "PENDING":
				return <Clock className="w-4 h-4 text-yellow-500" />;
			case "APPROVED":
				return <AlertCircle className="w-4 h-4 text-blue-500" />;
			case "COMPLETED":
				return <CheckCircle2 className="w-4 h-4 text-green-500" />;
			default:
				return null;
		}
	};

	const getStatusText = () => {
		switch (status) {
			case "PENDING":
				return "승인 대기중";
			case "APPROVED":
				return "봉사 예정";
			case "COMPLETED":
				return "봉사 완료";
			default:
				return "";
		}
	};

	return (
		<Link
			to={`/volunteer/${id}`}
			className="block bg-white rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all border border-gray-100"
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{getStatusIcon()}
						<span className="text-sm font-medium text-gray-600">
							{getStatusText()}
						</span>
					</div>
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<CalendarCheck className="w-3 h-3" />
						<span>{date}</span>
					</div>
				</div>

				<h3 className="font-medium text-gray-900 line-clamp-1">
					{title}
				</h3>

				<div className="flex items-center gap-2 text-sm text-gray-600">
					<span className="bg-gray-50 px-3 py-1 rounded-full">
						{startTime}
					</span>
					<span className="text-gray-400">~</span>
					<span className="bg-gray-50 px-3 py-1 rounded-full">
						{endTime}
					</span>
				</div>
			</div>
		</Link>
	);
};

export default function VolunteerTabContent() {
	const [activeTab, setActiveTab] = useState<VolunteerTabType>("PENDING");
	const queryClient = useQueryClient();

	const {
		data: volunteerData,
		isLoading,
		isFetching,
	} = useQuery<VolunteerApplicationResponse>({
		queryKey: ["volunteers", activeTab],
		queryFn: () => fetchAllMyVoluteersAPI(activeTab),
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		placeholderData: (previousData: any) => previousData,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	});

	// 다른 탭의 데이터 미리 가져오기
	useEffect(() => {
		const tabs: VolunteerTabType[] = ["PENDING", "APPROVED", "COMPLETED"];
		const otherTabs = tabs.filter((tab) => tab !== activeTab);

		for (const tab of otherTabs) {
			queryClient.prefetchQuery({
				queryKey: ["volunteers", tab],
				queryFn: () => fetchAllMyVoluteersAPI(tab),
				staleTime: 5 * 60 * 1000,
			});
		}
	}, [activeTab, queryClient]);

	const handleTabChange = (tab: VolunteerTabType) => {
		setActiveTab(tab);
	};

	const renderEmptyState = (type: VolunteerTabType) => {
		const messages = {
			PENDING: {
				title: "신청한 봉사가 없어요",
				description: "새로운 봉사 활동에 참여해보세요!",
				icon: <Clock className="w-12 h-12 text-gray-300 mb-4" />,
			},
			APPROVED: {
				title: "예정된 봉사가 없어요",
				description: "승인된 봉사 활동이 여기에 표시됩니다.",
				icon: <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />,
			},
			COMPLETED: {
				title: "완료한 봉사가 없어요",
				description: "봉사 활동을 완료하면 여기에 기록됩니다.",
				icon: <CheckCircle2 className="w-12 h-12 text-gray-300 mb-4" />,
			},
		};

		const { title, description, icon } = messages[type];

		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				{icon}
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					{title}
				</h3>
				<p className="text-gray-500">{description}</p>
			</div>
		);
	};

	return (
		<div className="pb-4">
			<div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
				<div className="flex gap-2">
					<button
						type="button"
						className={cn(
							"flex-1 text-sm py-2.5 font-medium rounded-full transition-all",
							activeTab === "PENDING"
								? "bg-male text-white shadow-sm"
								: "bg-gray-50 text-gray-600 hover:bg-gray-100",
						)}
						onClick={() => handleTabChange("PENDING")}
					>
						신청한 봉사
					</button>
					<button
						type="button"
						className={cn(
							"flex-1 text-sm py-2.5 font-medium rounded-full transition-all",
							activeTab === "APPROVED"
								? "bg-male text-white shadow-sm"
								: "bg-gray-50 text-gray-600 hover:bg-gray-100",
						)}
						onClick={() => handleTabChange("APPROVED")}
					>
						예정된 봉사
					</button>
					<button
						type="button"
						className={cn(
							"flex-1 text-sm py-2.5 font-medium rounded-full transition-all",
							activeTab === "COMPLETED"
								? "bg-male text-white shadow-sm"
								: "bg-gray-50 text-gray-600 hover:bg-gray-100",
						)}
						onClick={() => handleTabChange("COMPLETED")}
					>
						완료한 봉사
					</button>
				</div>
			</div>

			<div className="px-4 mt-2">
				{isLoading ? (
					<div className="flex items-center justify-center h-40">
						<Loader2 className="w-8 h-8 text-male animate-spin" />
					</div>
				) : volunteerData?.memberApplicationInfo?.length === 0 ? (
					renderEmptyState(activeTab)
				) : (
					<div className="space-y-2">
						{volunteerData?.memberApplicationInfo?.map(
							(volunteer) => (
								<VolunteerRecord
									key={volunteer.volunteerEventId}
									id={volunteer.volunteerEventId}
									date={volunteer.date}
									startTime={volunteer.startTime}
									endTime={volunteer.endTime}
									title={volunteer.title}
									status={volunteer.status}
								/>
							),
						)}
						{isFetching && (
							<div className="flex justify-center py-2">
								<Loader2 className="w-5 h-5 text-male animate-spin" />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

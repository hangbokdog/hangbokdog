import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CalendarCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMyVoluteersAPI } from "@/api/volunteer";
import type { VolunteerApplicationStatus } from "@/types/volunteer";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type VolunteerTabType = "PENDING" | "APPROVED" | "COMPLETED";

interface VolunteerRecordProps {
	id: number;
	date: string;
	title: string;
	status: VolunteerApplicationStatus;
}

const VolunteerRecord = ({ id, date, title }: VolunteerRecordProps) => {
	return (
		<Link
			to={`/volunteer/${id}`}
			className="flex items-center justify-between p-3 border rounded-lg mb-2 hover:shadow-sm transition-shadow"
		>
			<div className="flex flex-col">
				<div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
					<CalendarCheck className="w-4 h-4" />
					<span>{date}</span>
				</div>
				<div className="font-medium">{title}</div>
			</div>
		</Link>
	);
};

export default function VolunteerTabContent() {
	const [activeTab, setActiveTab] = useState<VolunteerTabType>("PENDING");
	const queryClient = useQueryClient();

	// 각 탭별로 독립적인 쿼리 사용
	const {
		data: volunteerData,
		isLoading,
		isPlaceholderData,
	} = useQuery({
		queryKey: ["volunteers", activeTab],
		queryFn: () => fetchAllMyVoluteersAPI(activeTab),
		staleTime: 5 * 60 * 1000, // 5분 동안 신선한 데이터로 간주
		gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
	});

	// 다음 탭 데이터 미리 가져오기 (사용자 경험 향상)
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

	const renderEmptyState = (type: VolunteerTabType) => {
		const messages = {
			PENDING:
				"대기중인 봉사 신청이 없어요.\n새로운 봉사 활동에 참여해보세요!",
			APPROVED: "승인된 봉사 신청이 없어요.\n봉사 활동을 신청해보세요!",
			COMPLETED: "완료한 봉사 활동이 없어요.\n봉사 활동에 참여해보세요!",
		};

		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-gray-500 whitespace-pre-line">
					{messages[type]}
				</p>
			</div>
		);
	};

	// 전체 로딩 상태 (초기 로딩 시에만 표시)
	if (isLoading && !isPlaceholderData) {
		return (
			<div className="flex items-center justify-center h-40">
				<Loader2 className="w-8 h-8 text-male animate-spin" />
			</div>
		);
	}

	return (
		<div>
			{/* Volunteer Tabs */}
			<div className="flex gap-2 mb-4 px-2">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "PENDING"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("PENDING")}
				>
					대기중
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "APPROVED"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("APPROVED")}
				>
					승인
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "COMPLETED"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("COMPLETED")}
				>
					완료
				</button>
			</div>

			<div className="p-2">
				{/* 탭 전환 시 깜빡임 방지를 위해 isFetching 상태는 별도로 처리하지 않음 */}
				{volunteerData?.memberApplicationInfo?.length === 0 ? (
					renderEmptyState(activeTab)
				) : (
					<div className="space-y-2">
						{volunteerData?.memberApplicationInfo?.map(
							(volunteer) => (
								<VolunteerRecord
									key={volunteer.volunteerEventId}
									id={volunteer.volunteerEventId}
									date={volunteer.date}
									title={volunteer.title}
									status={volunteer.status}
								/>
							),
						)}
					</div>
				)}
			</div>
		</div>
	);
}

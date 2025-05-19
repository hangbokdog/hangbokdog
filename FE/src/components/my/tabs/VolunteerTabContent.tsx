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

const VolunteerRecord = ({ id, date, title, status }: VolunteerRecordProps) => {
	const statusColors = {
		PENDING: "bg-yellow-100 text-yellow-800",
		APPROVED: "bg-blue-100 text-blue-800",
		COMPLETED: "bg-green-100 text-green-800",
		REJECTED: "bg-red-100 text-red-800",
		NONE: "bg-gray-100 text-gray-800",
	};

	const statusText = {
		PENDING: "대기중",
		APPROVED: "승인",
		COMPLETED: "완료",
		REJECTED: "거절",
		NONE: "없음",
	};

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
			<div
				className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}
			>
				{statusText[status]}
			</div>
		</Link>
	);
};

export default function VolunteerTabContent() {
	const [activeTab, setActiveTab] = useState<VolunteerTabType>("PENDING");
	const queryClient = useQueryClient();

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

	const { data: volunteerData, isLoading } = useQuery({
		queryKey: ["volunteers", activeTab],
		queryFn: () => fetchAllMyVoluteersAPI(activeTab),
	});

	useEffect(() => {
		return () => {
			queryClient.invalidateQueries({
				queryKey: ["volunteers", activeTab],
			});
		};
	}, [queryClient, activeTab]);

	if (isLoading) {
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
				{volunteerData?.memberApplicationInfo.length === 0 ? (
					renderEmptyState(activeTab)
				) : (
					<div className="space-y-2">
						{volunteerData?.memberApplicationInfo.map(
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

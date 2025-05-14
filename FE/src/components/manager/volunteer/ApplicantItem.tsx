import { Calendar, Clock, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { VolunteerApplicant } from "@/types/volunteer";
import { updateVolunteerApplicantStatusAPI } from "@/api/volunteer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useCenterStore from "@/lib/store/centerStore";

export interface ApplicantItemProps {
	applicant: VolunteerApplicant;
	formatDate: (date: string) => string;
	isApproved?: boolean;
	eventId?: number;
}

export const ApplicantItem = ({
	applicant,
	formatDate,
	isApproved = false,
	eventId,
}: ApplicantItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const queryClient = useQueryClient();
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

	const { mutate: approveVolunteerApplicantStatus } = useMutation({
		mutationKey: ["approveVolunteerApplicantStatus", applicant.id, eventId],
		mutationFn: () =>
			updateVolunteerApplicantStatusAPI({
				eventId: eventId as number,
				applicationId: applicant.id,
				status: "APPROVED",
			}),
		onSuccess: () => {
			toast.success("봉사 신청이 승인되었습니다.");
			queryClient.invalidateQueries({
				queryKey: ["approvedApplicants", centerId, eventId, "approved"],
			});
			queryClient.invalidateQueries({
				queryKey: ["pendingApplicants", centerId, eventId, "pending"],
			});
		},
		onError: () => {
			toast.error("봉사 신청 승인에 실패했습니다.");
		},
	});

	return (
		<div
			key={applicant.id}
			className={`border rounded-xl p-4 shadow-sm ${
				isApproved
					? "bg-green-50 border-green-100"
					: "bg-white border-gray-100"
			} text-left w-full`}
			onClick={() => setIsExpanded(!isExpanded)}
			aria-expanded={isExpanded}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setIsExpanded(!isExpanded);
				}
			}}
		>
			<div className="flex items-start gap-3">
				<div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
					<img
						src={
							applicant.profileImage ||
							"https://via.placeholder.com/48"
						}
						alt={applicant.nickname}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="flex-1">
					<div className="flex justify-between items-start">
						<h4 className="font-bold text-gray-900">
							{applicant.nickname}
							<span className="text-gray-500 font-normal ml-1">
								({applicant.name})
							</span>
						</h4>
						{isApproved ? (
							<span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
								승인됨
							</span>
						) : (
							<span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
								대기중
							</span>
						)}
					</div>

					<div className="flex items-center mt-1 text-sm text-gray-600">
						<Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
						<span>신청일: {formatDate(applicant.createdAt)}</span>
					</div>

					{/* 기본 정보 */}
					<div className="mt-2 grid grid-cols-2 gap-1">
						{applicant.phone && (
							<div className="flex items-center text-xs text-gray-600">
								<Phone className="w-3 h-3 mr-1 text-gray-400" />
								<span>{applicant.phone}</span>
							</div>
						)}
						<div className="flex items-center text-xs text-gray-600">
							<Mail className="w-3 h-3 mr-1 text-gray-400" />
							<span>{applicant.email}</span>
						</div>
						<div className="flex items-center text-xs text-gray-600">
							<User className="w-3 h-3 mr-1 text-gray-400" />
							<span>{applicant.age}세</span>
						</div>
					</div>

					{/* 확장된 정보 */}
					{isExpanded && (
						<div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
							<div className="bg-gray-50 p-3 rounded-lg text-sm">
								<p className="text-gray-700 mb-1">
									<strong>회원 ID:</strong>{" "}
									{applicant.memberId}
								</p>
								<p className="text-gray-700 mb-1">
									<strong>생년월일:</strong> {applicant.birth}
								</p>
								<p className="text-gray-700">
									<strong>권한:</strong> {applicant.grade}
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 버튼 영역 */}
			{!isApproved && (
				<div
					className="flex justify-end gap-2 mt-3"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="border-red-300 text-red-500 hover:bg-red-50 rounded-full font-medium px-5"
							>
								거절
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									봉사 신청 거절
								</AlertDialogTitle>
								<AlertDialogDescription>
									{applicant.name}님의 봉사 신청을
									거절하시겠습니까?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="rounded-full">
									취소
								</AlertDialogCancel>
								<AlertDialogAction className="bg-red-500 hover:bg-red-600 rounded-full">
									거절하기
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								size="sm"
								className="bg-blue-500 hover:bg-blue-600 rounded-full font-medium px-5"
							>
								승인
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									봉사 신청 승인
								</AlertDialogTitle>
								<AlertDialogDescription>
									{applicant.name}님의 봉사 신청을
									승인하시겠습니까?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="rounded-full">
									취소
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										approveVolunteerApplicantStatus()
									}
									className="bg-blue-500 hover:bg-blue-600 rounded-full"
								>
									승인하기
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}
		</div>
	);
};

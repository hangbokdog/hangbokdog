import { Calendar, Clock } from "lucide-react";
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
import type { ApplicantItemProps } from "@/types/volunteer";

export const ApplicantItem = ({
	applicant,
	onApprove,
	onReject,
	formatDate,
	isApproved = false,
}: ApplicantItemProps) => {
	return (
		<div
			key={applicant.id}
			className={`border rounded-md p-3 ${isApproved ? "bg-green-50" : "bg-gray-50"}`}
		>
			<div className="flex justify-between items-start">
				<div>
					<h4 className="font-medium">
						{applicant.nickname} ({applicant.name})
					</h4>
					<p className="text-sm text-gray-600 mt-1">
						{applicant.phoneNumber}
					</p>
					{!isApproved && (
						<p className="text-sm text-gray-600 flex items-center mt-1">
							<Calendar className="w-4 h-4 mr-1 text-gray-400" />
							신청일:{" "}
							{new Date(
								applicant.requestDate,
							).toLocaleDateString()}
						</p>
					)}
					<p className="text-sm text-gray-600 flex items-center mt-1">
						<Clock className="w-4 h-4 mr-1 text-gray-400" />
						{formatDate(applicant.volunteerDate)}{" "}
						{applicant.timeSlot === "morning" ? "오전" : "오후"}
					</p>
				</div>
				{isApproved ? (
					<div>
						<span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
							수락됨
						</span>
					</div>
				) : (
					<div className="flex gap-2">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="border-red-300 text-red-500 hover:bg-red-50"
									onClick={() => {}}
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
									<AlertDialogCancel>취소</AlertDialogCancel>
									<AlertDialogAction
										className="bg-red-500 hover:bg-red-600"
										onClick={() => onReject(applicant.id)}
									>
										거절하기
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									size="sm"
									className="bg-blue-500 hover:bg-blue-600"
									onClick={() => {}}
								>
									수락
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										봉사 신청 수락
									</AlertDialogTitle>
									<AlertDialogDescription>
										{applicant.name}님의 봉사 신청을
										수락하시겠습니까?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>취소</AlertDialogCancel>
									<AlertDialogAction
										className="bg-blue-500 hover:bg-blue-600"
										onClick={() => onApprove(applicant.id)}
									>
										수락하기
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</div>
		</div>
	);
};

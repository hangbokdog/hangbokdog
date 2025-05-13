import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicantItem } from "./ApplicantItem";
import type { ApplicantsListProps } from "@/types/volunteer";

export const ApplicantsList = ({
	pendingApplicants,
	approvedApplicants,
	isLoading,
	onApprove,
	onReject,
	formatDate,
}: ApplicantsListProps) => {
	return (
		<Tabs defaultValue="pending" className="mt-4">
			<TabsList className="grid w-full grid-cols-2 bg-superLightBlueGray">
				<TabsTrigger value="pending">
					대기 중 ({pendingApplicants.length})
				</TabsTrigger>
				<TabsTrigger value="approved">
					승인됨 ({approvedApplicants.length})
				</TabsTrigger>
			</TabsList>

			<TabsContent value="pending" className="mt-4 space-y-3">
				{isLoading ? (
					<>
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</>
				) : pendingApplicants.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						대기 중인 봉사 신청이 없습니다.
					</div>
				) : (
					pendingApplicants.map((applicant) => (
						<ApplicantItem
							key={applicant.id}
							applicant={applicant}
							onApprove={onApprove}
							onReject={onReject}
							formatDate={formatDate}
						/>
					))
				)}
			</TabsContent>

			<TabsContent value="approved" className="mt-4 space-y-3">
				{isLoading ? (
					<>
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</>
				) : approvedApplicants.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						수락된 봉사자가 없습니다.
					</div>
				) : (
					approvedApplicants.map((applicant) => (
						<ApplicantItem
							key={applicant.id}
							applicant={applicant}
							onApprove={onApprove}
							onReject={onReject}
							formatDate={formatDate}
							isApproved={true}
						/>
					))
				)}
			</TabsContent>
		</Tabs>
	);
};

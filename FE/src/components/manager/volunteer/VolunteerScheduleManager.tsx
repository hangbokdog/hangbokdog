import { Calendar, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getVolunteersByAddressBookAPI,
	deleteVolunteerAPI,
} from "@/api/volunteer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { VolunteerItem } from "./VolunteerItem";
import { formatDate } from "@/lib/hooks/useFormatDate";
import type { VolunteerScheduleManagerProps } from "@/types/volunteer";

export default function VolunteerScheduleManager({
	address,
}: VolunteerScheduleManagerProps) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// API 데이터 가져오기
	const { data: volunteers = [], isLoading: isVolunteersLoading } = useQuery({
		queryKey: ["volunteers", address.id],
		queryFn: () =>
			getVolunteersByAddressBookAPI({
				addressBookId: address.id.toString(),
			}),
	});

	// 봉사활동 삭제
	const deleteVolunteerMutation = useMutation({
		mutationFn: deleteVolunteerAPI,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["volunteers", address.id],
			});
			toast.success("봉사활동 일정이 삭제되었습니다.");
		},
		onError: () => {
			toast.error("일정 삭제 실패");
		},
	});

	// 일정 생성 페이지로 이동
	const handleAddSchedule = () => {
		navigate(`/manager/volunteer/create?addressBookId=${address.id}`);
	};

	// 일정 삭제하기
	const handleDeleteSchedule = (id: number) => {
		deleteVolunteerMutation.mutate({ id });
	};

	return (
		<div className="flex flex-col gap-5">
			{/* 봉사 일정 섹션 */}
			<div className="bg-white rounded-lg shadow-sm p-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium flex items-center">
						<Calendar className="w-5 h-5 mr-2 text-blue-500" />
						봉사 일정 관리
					</h3>
					<Button
						onClick={handleAddSchedule}
						className="flex items-center bg-blue-500 text-white"
						size="sm"
					>
						<Plus className="w-4 h-4 mr-1" />
						일정 추가
					</Button>
				</div>

				{/* 일정 목록 */}
				{isVolunteersLoading ? (
					<div className="space-y-3">
						{[1, 2].map((i) => (
							<div
								key={i}
								className="border rounded-md p-3 bg-gray-50 flex flex-col gap-2"
							>
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-2/3" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				) : volunteers && volunteers.length > 0 ? (
					<div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
						{volunteers.map((volunteer) => (
							<VolunteerItem
								key={volunteer.id}
								volunteer={volunteer}
								onDelete={handleDeleteSchedule}
								formatDate={formatDate}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						등록된 봉사 일정이 없습니다.
					</div>
				)}
			</div>
		</div>
	);
}

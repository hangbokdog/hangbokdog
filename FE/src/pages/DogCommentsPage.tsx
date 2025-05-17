import { useState, useCallback, useEffect } from "react";
import CommentList from "@/components/comments/CommentList";
import CommentForm from "@/components/comments/CommentForm";
import useCenterStore from "@/lib/store/centerStore";
import useAuthStore from "@/lib/store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelJoinRequestAPI, registerCenterAPI } from "@/api/center";
import { toast } from "sonner";
import { getDogCommentsAPI, createDogCommentAPI } from "@/api/dog";
import type { DogCommentItem } from "@/types/dog";

export default function DogCommentsPage() {
	const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
	const [replyValue, setReplyValue] = useState("");
	const [replyLength, setReplyLength] = useState(0);
	const [commentValue, setCommentValue] = useState("");
	const { isCenterMember, selectedCenter, setSelectedCenter } =
		useCenterStore();
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { id } = useParams();

	// 수동으로 댓글 데이터를 리프레시
	const refreshComments = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["dogComments", id],
			refetchType: "all",
		});
	}, [queryClient, id]);

	// 댓글 데이터 조회 - 수동 리프레시 키를 추가하고 staleTime을 0으로 설정
	const { data: comments = [] } = useQuery<DogCommentItem[]>({
		queryKey: ["dogComments", id],
		queryFn: () => getDogCommentsAPI(Number(id)),
		staleTime: 0, // 항상 최신 데이터를 가져오도록 설정
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});

	// 컴포넌트가 마운트될 때 데이터 리프레시
	useEffect(() => {
		refreshComments();
	}, [refreshComments]);

	// 댓글 수 계산 함수
	const getTotalCommentCount = () => {
		let totalCount = 0;
		totalCount += comments.length;
		for (const comment of comments) {
			totalCount += comment.replies.length;
		}
		return totalCount;
	};

	const { mutate: registerCenter } = useMutation({
		mutationFn: () => registerCenterAPI(selectedCenter?.centerId as string),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			if (selectedCenter) {
				setSelectedCenter({
					centerId: selectedCenter.centerId,
					centerName: selectedCenter.centerName,
					status: "APPLIED",
					centerJoinRequestId: data.centerJoinRequestId,
				});
			}
			toast.success("가입 신청이 완료되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청에 실패했습니다.");
		},
	});

	const { mutate: cancelJoinRequest } = useMutation({
		mutationFn: () =>
			cancelJoinRequestAPI(selectedCenter?.centerJoinRequestId as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			if (selectedCenter) {
				setSelectedCenter({
					centerId: selectedCenter.centerId,
					centerName: selectedCenter.centerName,
					status: "NONE",
					centerJoinRequestId: "",
				});
			}
			toast.success("가입 신청이 취소되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청 취소에 실패했습니다.");
		},
	});

	const { mutate: createDogComment } = useMutation({
		mutationFn: () =>
			createDogCommentAPI(Number(id), commentValue, replyOpenId || null),
		onSuccess: () => {
			refreshComments();
			setCommentValue("");
			toast.success("댓글이 등록되었습니다.");
		},
		onError: () => {
			toast.error("댓글 작성에 실패했습니다.");
		},
	});

	const handleReplySubmit = (commentId: number) => {
		if (!replyValue.trim()) return;
		if (!user.nickName) {
			toast.error("사용자 정보를 가져오는데 실패했습니다.");
			return;
		}

		createDogCommentAPI(Number(id), replyValue, commentId)
			.then(() => {
				refreshComments();
				setReplyValue("");
				setReplyOpenId(null);
				setReplyLength(0);
				toast.success("답글이 등록되었습니다.");
			})
			.catch(() => {
				toast.error("답글 작성에 실패했습니다.");
			});
	};

	const handleCommentSubmit = () => {
		if (!commentValue.trim()) return;
		if (!user.nickName) {
			toast.error("사용자 정보를 가져오는데 실패했습니다.");
			return;
		}

		createDogComment();
	};

	const handleCenterJoinRequest = () => {
		if (!selectedCenter) {
			navigate("/center-decision");
			return;
		}

		switch (selectedCenter.status) {
			case "APPLIED":
				cancelJoinRequest();
				break;
			case "NONE":
				registerCenter();
				break;
			default:
				navigate("/center-decision");
				break;
		}
	};

	const getButtonText = () => {
		if (!selectedCenter) return "보호소 가입 신청하기";

		switch (selectedCenter.status) {
			case "APPLIED":
				return "가입 신청 취소하기";
			case "NONE":
				return `${selectedCenter.centerName} 가입 신청하기`;
			default:
				return "보호소 선택하기";
		}
	};

	const getButtonStyle = () => {
		if (!selectedCenter) return "bg-male";

		switch (selectedCenter.status) {
			case "APPLIED":
				return "bg-red";
			case "NONE":
				return "bg-male";
			default:
				return "bg-male";
		}
	};

	return (
		<div className="flex flex-col h-full relative bg-white">
			<div className="flex items-center gap-1 mx-2.5">
				<span className="text-lg font-bold leading-6">댓글</span>
				<span className="text-sm font-medium text-blueGray">
					{getTotalCommentCount()}
				</span>
			</div>
			<CommentList
				comments={comments}
				replyOpenId={replyOpenId}
				setReplyOpenId={setReplyOpenId}
				replyValue={replyValue}
				setReplyValue={setReplyValue}
				replyLength={replyLength}
				setReplyLength={setReplyLength}
				handleReplySubmit={handleReplySubmit}
			/>
			{isCenterMember ? (
				<CommentForm
					commentValue={commentValue}
					setCommentValue={setCommentValue}
					handleCommentSubmit={handleCommentSubmit}
				/>
			) : (
				<div
					className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white border-t flex flex-col gap-2 items-center px-4 py-4"
					style={{ zIndex: 10 }}
				>
					<p className="text-grayText text-sm">
						댓글을 작성하려면{" "}
						{selectedCenter?.centerName || "보호소"} 회원으로
						가입해야 합니다.
					</p>
					<button
						type="button"
						className={`${getButtonStyle()} rounded-full text-white px-6 py-2 text-sm font-semibold w-full`}
						onClick={handleCenterJoinRequest}
					>
						{getButtonText()}
					</button>
				</div>
			)}
		</div>
	);
}

import { useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import useCenterStore from "@/lib/store/centerStore";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 가입 요청 타입 정의
interface JoinRequest {
	id: string;
	userName: string;
	userImage: string;
	requestDate: Date;
	message: string;
}

// 더미 가입 요청 데이터
const dummyRequests: JoinRequest[] = [
	{
		id: "1",
		userName: "김영희",
		userImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user1&backgroundColor=ffdfbf",
		requestDate: new Date("2023-05-15"),
		message:
			"안녕하세요! 강아지를 정말 좋아해서 봉사활동에 참여하고 싶습니다. 주말에 시간이 있어서 도움을 드리고 싶습니다.",
	},
	{
		id: "2",
		userName: "이준호",
		userImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user2&backgroundColor=b6e3f4",
		requestDate: new Date("2023-05-14"),
		message: "동물 보호에 관심이 많습니다. 사진 촬영 봉사도 가능합니다.",
	},
	{
		id: "3",
		userName: "박지민",
		userImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user3&backgroundColor=c0aede",
		requestDate: new Date("2023-05-13"),
		message:
			"강아지 트레이너 자격증이 있습니다. 훈련 봉사를 하고 싶습니다.",
	},
];

export default function RequestPanel() {
	const { selectedCenter } = useCenterStore();
	const [requests, setRequests] = useState<JoinRequest[]>(dummyRequests);
	const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
		null,
	);

	// 요청 수락 처리
	const handleAccept = (id: string) => {
		// 실제로는 API 호출 후 성공 시 목록에서 제거
		setRequests((prev) => prev.filter((request) => request.id !== id));
		// 성공 토스트 메시지 표시
	};

	// 요청 거절 처리
	const handleReject = (id: string) => {
		// 실제로는 API 호출 후 성공 시 목록에서 제거
		setRequests((prev) => prev.filter((request) => request.id !== id));
		// 성공 토스트 메시지 표시
	};

	// 요청 상세 내용 토글
	const toggleExpandRequest = (id: string) => {
		if (expandedRequestId === id) {
			setExpandedRequestId(null);
		} else {
			setExpandedRequestId(id);
		}
	};

	return (
		<div className="flex flex-col">
			<div className="mb-4">
				<h2 className="text-lg font-bold text-gray-800">
					{selectedCenter?.centerName || "센터"} 가입 요청
				</h2>
				<p className="text-sm text-gray-500">
					새로운 봉사자 및 후원자 가입 요청을 관리하세요
				</p>
			</div>

			{/* 요청 목록 */}
			<div className="space-y-3">
				{requests.length === 0 ? (
					<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
						새로운 가입 요청이 없습니다.
					</p>
				) : (
					requests.map((request) => (
						<div
							key={request.id}
							className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
						>
							<div className="p-4">
								<div className="flex items-start gap-3">
									<Avatar className="w-10 h-10 border">
										<img
											src={request.userImage}
											alt={request.userName}
										/>
									</Avatar>

									<div className="flex-1">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-medium text-gray-800">
													{request.userName}
												</h3>
												<p className="text-xs text-gray-500">
													{format(
														request.requestDate,
														"yyyy년 MM월 dd일",
														{ locale: ko },
													)}
													에 요청
												</p>
											</div>

											<div className="flex items-center space-x-1">
												<button
													type="button"
													className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
													onClick={() =>
														handleAccept(request.id)
													}
													aria-label="수락"
												>
													<HiCheck className="size-5" />
												</button>
												<button
													type="button"
													className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
													onClick={() =>
														handleReject(request.id)
													}
													aria-label="거절"
												>
													<HiX className="size-5" />
												</button>
											</div>
										</div>

										<div className="mt-2">
											<button
												type="button"
												onClick={() =>
													toggleExpandRequest(
														request.id,
													)
												}
												className="text-sm text-main font-medium"
											>
												{expandedRequestId ===
												request.id
													? "접기"
													: "메시지 보기"}
											</button>

											{expandedRequestId ===
												request.id && (
												<p className="mt-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
													{request.message}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

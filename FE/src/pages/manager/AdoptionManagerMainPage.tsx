import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import {
	Check,
	X,
	ChevronDown,
	ChevronUp,
	Clock,
	Search,
	Filter,
	Home,
	Calendar,
} from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";

// 입양 신청 타입 정의
interface AdoptionRequest {
	id: string;
	dogName: string;
	dogImage: string;
	applicantName: string;
	applicantImage: string;
	date: Date;
	status: "pending" | "approved" | "rejected";
	message: string;
	phone: string;
	address: string;
	hasExperience: boolean;
	familySize: number;
	homeType: "house" | "apartment";
}

// 입양 가능 강아지 타입 정의
interface AdoptableDog {
	id: string;
	name: string;
	image: string;
	age: string;
	gender: "male" | "female";
	breed: string;
	description: string;
	requests: number;
}

// 더미 입양 신청 데이터
const dummyRequests: AdoptionRequest[] = [
	{
		id: "ar1",
		dogName: "몽실이",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog1",
		applicantName: "김영희",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user1&backgroundColor=ffdfbf",
		date: new Date("2023-05-15"),
		status: "pending",
		message:
			"몽실이의 사진을 보고 첫눈에 반해서 입양 신청합니다. 저희 가족들이 함께 몽실이를 사랑으로 돌볼 준비가 되어있습니다.",
		phone: "010-1234-5678",
		address: "서울시 강남구 테헤란로 123",
		hasExperience: true,
		familySize: 3,
		homeType: "apartment",
	},
	{
		id: "ar2",
		dogName: "초코",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog2",
		applicantName: "이준호",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user2&backgroundColor=b6e3f4",
		date: new Date("2023-05-14"),
		status: "approved",
		message:
			"초코의 입양을 희망합니다. 넓은 마당이 있는 주택에서 충분한 운동공간을 제공할 수 있습니다.",
		phone: "010-2345-6789",
		address: "경기도 고양시 일산동구 강촌로 456",
		hasExperience: true,
		familySize: 4,
		homeType: "house",
	},
	{
		id: "ar3",
		dogName: "해피",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog3",
		applicantName: "박지민",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user3&backgroundColor=c0aede",
		date: new Date("2023-05-13"),
		status: "rejected",
		message:
			"해피와 함께 행복한 가정을 꾸리고 싶습니다. 매일 산책하고 돌봐줄 수 있어요.",
		phone: "010-3456-7890",
		address: "서울시 마포구 홍대로 789",
		hasExperience: false,
		familySize: 1,
		homeType: "apartment",
	},
	{
		id: "ar4",
		dogName: "루시",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog4",
		applicantName: "최민지",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user4&backgroundColor=f4cab6",
		date: new Date("2023-05-12"),
		status: "pending",
		message:
			"루시를 보고 한눈에 반했어요. 저희 집에 가족으로 맞이하고 싶습니다.",
		phone: "010-4567-8901",
		address: "부산시 해운대구 마린시티 101",
		hasExperience: true,
		familySize: 2,
		homeType: "apartment",
	},
];

// 더미 입양 가능 강아지 데이터
const dummyDogs: AdoptableDog[] = [
	{
		id: "dog1",
		name: "몽실이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog1&backgroundColor=b6e3f4",
		age: "2살",
		gender: "female",
		breed: "말티즈",
		description:
			"활발하고 사람을 좋아하는 몽실이에요. 사람 무릎 위에 앉아있는 걸 좋아합니다.",
		requests: 3,
	},
	{
		id: "dog2",
		name: "초코",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog2&backgroundColor=f4cab6",
		age: "3살",
		gender: "male",
		breed: "푸들",
		description:
			"온순하고 조용한 초코입니다. 훈련이 잘 되어있고 산책을 좋아해요.",
		requests: 1,
	},
	{
		id: "dog3",
		name: "해피",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog3&backgroundColor=c0aede",
		age: "1살",
		gender: "male",
		breed: "비숑 프리제",
		description:
			"장난기 많고 활발한 강아지입니다. 다른 강아지들과 잘 어울려요.",
		requests: 2,
	},
	{
		id: "dog4",
		name: "루시",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog4&backgroundColor=ffdfbf",
		age: "5살",
		gender: "female",
		breed: "시바견",
		description:
			"조용하지만 충성심 강한 루시입니다. 주인과 산책하는 것을 가장 좋아해요.",
		requests: 4,
	},
];

export default function AdoptionManagerMainPage() {
	const { selectedCenter } = useCenterStore();
	const [filter, setFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

	// 대시보드 통계 데이터
	const stats = {
		total: dummyRequests.length,
		pending: dummyRequests.filter((req) => req.status === "pending").length,
		approved: dummyRequests.filter((req) => req.status === "approved")
			.length,
		rejected: dummyRequests.filter((req) => req.status === "rejected")
			.length,
	};

	// 필터링된 요청 목록
	const filteredRequests = dummyRequests.filter((request) => {
		// 상태 필터링
		if (filter !== "all" && request.status !== filter) return false;

		// 검색어 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				request.dogName.toLowerCase().includes(query) ||
				request.applicantName.toLowerCase().includes(query)
			);
		}

		return true;
	});

	// 요청 확장/축소 토글
	const toggleRequest = (id: string) => {
		if (expandedRequestId === id) {
			setExpandedRequestId(null);
		} else {
			setExpandedRequestId(id);
		}
	};

	// 요청 승인/거절 처리
	const handleRequestAction = (
		id: string,
		action: "approved" | "rejected",
	) => {
		// 실제로는 API 호출하여 상태 업데이트
		console.log(`${action === "approved" ? "승인" : "거절"} 처리: ${id}`);

		// 여기서는 더미 데이터를 직접 수정하지 않음
		// 실제 구현 시에는 API 호출 후 상태 업데이트
	};

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<h1 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
						<Home className="w-5 h-5 mr-2 text-blue-600" />
						입양 관리
					</h1>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 입양 신청
						내역을 관리하세요
					</p>
				</div>
			</div>

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 상태 카드 */}
				<div className="grid grid-cols-4 gap-2">
					<div
						className={`bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center border-b-2 ${filter === "all" ? "border-blue-500" : "border-transparent"}`}
						onClick={() => setFilter("all")}
						onKeyDown={(e) => e.key === "Enter" && setFilter("all")}
					>
						<span className="text-lg font-bold">{stats.total}</span>
						<span className="text-xs text-gray-500">전체</span>
					</div>
					<div
						className={`bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center border-b-2 ${filter === "pending" ? "border-amber-500" : "border-transparent"}`}
						onClick={() => setFilter("pending")}
						onKeyDown={(e) =>
							e.key === "Enter" && setFilter("pending")
						}
					>
						<span className="text-lg font-bold text-amber-600">
							{stats.pending}
						</span>
						<span className="text-xs text-gray-500">대기</span>
					</div>
					<div
						className={`bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center border-b-2 ${filter === "approved" ? "border-green-500" : "border-transparent"}`}
						onClick={() => setFilter("approved")}
						onKeyDown={(e) =>
							e.key === "Enter" && setFilter("approved")
						}
					>
						<span className="text-lg font-bold text-green-600">
							{stats.approved}
						</span>
						<span className="text-xs text-gray-500">승인</span>
					</div>
					<div
						className={`bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center border-b-2 ${filter === "rejected" ? "border-red-500" : "border-transparent"}`}
						onClick={() => setFilter("rejected")}
						onKeyDown={(e) =>
							e.key === "Enter" && setFilter("rejected")
						}
					>
						<span className="text-lg font-bold text-red-600">
							{stats.rejected}
						</span>
						<span className="text-xs text-gray-500">거절</span>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="flex gap-2">
					<div className="relative flex-1">
						<input
							type="text"
							className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
							placeholder="강아지 또는 신청자 이름으로 검색"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					</div>
					<button
						type="button"
						className="p-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
						onClick={() =>
							setIsFilterDrawerOpen(!isFilterDrawerOpen)
						}
					>
						<Filter className="w-5 h-5" />
					</button>
				</div>

				{/* 필터 드로어 */}
				{isFilterDrawerOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
					>
						<div className="p-4">
							<h3 className="font-medium text-gray-800 mb-2">
								상세 필터링
							</h3>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									경험 있음
								</button>
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									주택
								</button>
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									아파트
								</button>
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									1인 가구
								</button>
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									다가구
								</button>
							</div>
							<div className="flex justify-end mt-3">
								<button
									type="button"
									className="text-sm text-blue-600 font-medium"
								>
									필터 초기화
								</button>
							</div>
						</div>
					</motion.div>
				)}

				{/* 다가오는 방문 일정 */}
				<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
					<div className="flex justify-between items-center mb-3">
						<h2 className="font-semibold text-gray-800 flex items-center">
							<Calendar className="w-4 h-4 mr-2 text-blue-600" />
							다가오는 방문 일정
						</h2>
						<button type="button" className="text-xs text-blue-600">
							전체보기
						</button>
					</div>
					<div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
						<div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
							<span>24</span>
						</div>
						<div className="flex-grow">
							<p className="text-sm font-medium">
								김영희 (몽실이 입양 방문)
							</p>
							<p className="text-xs text-gray-500">
								5월 24일 오후 2:00
							</p>
						</div>
						<button
							type="button"
							className="px-3 py-1 bg-white text-blue-600 text-xs font-medium rounded-full shadow-sm"
						>
							상세
						</button>
					</div>
				</div>

				{/* 입양 신청 목록 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						입양 신청 목록
					</h2>
					<div className="space-y-3">
						{filteredRequests.length === 0 ? (
							<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
								입양 신청 내역이 없습니다
							</p>
						) : (
							filteredRequests.map((request) => (
								<div
									key={request.id}
									className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
								>
									<div
										className="p-4 cursor-pointer"
										onClick={() =>
											toggleRequest(request.id)
										}
										onKeyDown={(e) =>
											e.key === "Enter" &&
											toggleRequest(request.id)
										}
									>
										<div className="flex items-center gap-3">
											<div className="relative">
												<img
													src={request.dogImage}
													alt={request.dogName}
													className="w-12 h-12 rounded-lg object-cover border border-gray-200"
												/>
												<img
													src={request.applicantImage}
													alt={request.applicantName}
													className="w-6 h-6 rounded-full border border-white absolute -bottom-1 -right-1"
												/>
											</div>

											<div className="flex-1">
												<div className="flex justify-between items-start">
													<div>
														<div className="flex items-center gap-2">
															<h3 className="font-medium text-gray-800">
																{
																	request.applicantName
																}
															</h3>
															<span
																className={`text-xs px-2 py-0.5 rounded-full ${
																	request.status ===
																	"pending"
																		? "bg-amber-100 text-amber-700"
																		: request.status ===
																				"approved"
																			? "bg-green-100 text-green-700"
																			: "bg-red-100 text-red-700"
																}`}
															>
																{request.status ===
																"pending"
																	? "대기중"
																	: request.status ===
																			"approved"
																		? "승인됨"
																		: "거절됨"}
															</span>
														</div>
														<p className="text-xs text-gray-500 mt-0.5">
															{request.dogName}{" "}
															입양 신청 •{" "}
															{format(
																request.date,
																"MM월 dd일",
																{ locale: ko },
															)}
														</p>
													</div>

													<div className="flex items-center">
														{request.status ===
															"pending" && (
															<>
																<button
																	type="button"
																	className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 mr-1"
																	onClick={(
																		e,
																	) => {
																		e.stopPropagation();
																		handleRequestAction(
																			request.id,
																			"approved",
																		);
																	}}
																	aria-label="승인"
																>
																	<Check className="w-4 h-4" />
																</button>
																<button
																	type="button"
																	className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
																	onClick={(
																		e,
																	) => {
																		e.stopPropagation();
																		handleRequestAction(
																			request.id,
																			"rejected",
																		);
																	}}
																	aria-label="거절"
																>
																	<X className="w-4 h-4" />
																</button>
															</>
														)}
														{expandedRequestId ===
														request.id ? (
															<ChevronUp className="w-5 h-5 text-gray-400 ml-2" />
														) : (
															<ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
														)}
													</div>
												</div>
											</div>
										</div>

										{/* 확장된 상세 정보 */}
										{expandedRequestId === request.id && (
											<div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
												<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-3">
													{request.message}
												</p>
												<div className="grid grid-cols-2 gap-2 text-xs">
													<div>
														<p className="text-gray-500">
															연락처
														</p>
														<p className="font-medium">
															{request.phone}
														</p>
													</div>
													<div>
														<p className="text-gray-500">
															입양 경험
														</p>
														<p className="font-medium">
															{request.hasExperience
																? "있음"
																: "없음"}
														</p>
													</div>
													<div>
														<p className="text-gray-500">
															주거 형태
														</p>
														<p className="font-medium">
															{request.homeType ===
															"house"
																? "단독 주택"
																: "아파트/빌라"}
														</p>
													</div>
													<div>
														<p className="text-gray-500">
															가족 구성원
														</p>
														<p className="font-medium">
															{request.familySize}
															인 가구
														</p>
													</div>
												</div>
												<div className="mt-2">
													<p className="text-gray-500 text-xs">
														주소
													</p>
													<p className="text-sm font-medium">
														{request.address}
													</p>
												</div>

												{request.status ===
													"pending" && (
													<div className="flex justify-end gap-2 mt-3">
														<button
															type="button"
															className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg"
															onClick={(e) => {
																e.stopPropagation();
																handleRequestAction(
																	request.id,
																	"rejected",
																);
															}}
														>
															거절하기
														</button>
														<button
															type="button"
															className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
															onClick={(e) => {
																e.stopPropagation();
																handleRequestAction(
																	request.id,
																	"approved",
																);
															}}
														>
															승인하기
														</button>
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* 입양 가능 강아지 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						입양 가능 강아지
					</h2>
					<div className="grid grid-cols-2 gap-3">
						{dummyDogs.map((dog) => (
							<div
								key={dog.id}
								className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
							>
								<div className="relative">
									<img
										src={dog.image}
										alt={dog.name}
										className="w-full h-32 object-cover"
									/>
									<div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-blue-700 flex items-center">
										<Clock className="w-3 h-3 mr-1" />
										신청 {dog.requests}건
									</div>
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
										<h3 className="font-medium text-white">
											{dog.name}
										</h3>
									</div>
								</div>
								<div className="p-3">
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm font-medium">
											{dog.breed}
										</span>
										<div
											className={`text-xs px-2 py-0.5 rounded-full ${dog.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}
										>
											{dog.gender === "male"
												? "남아"
												: "여아"}{" "}
											• {dog.age}
										</div>
									</div>
									<p className="text-xs text-gray-500 line-clamp-2">
										{dog.description}
									</p>
									<button
										type="button"
										className="mt-2 text-xs text-blue-600 font-medium"
									>
										상세 정보
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

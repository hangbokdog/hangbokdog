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
	PawPrint,
	Calendar,
	Clock3,
} from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";

// 임시 보호 신청 타입 정의
interface FosterRequest {
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
	fosterPeriod: string; // 임시 보호 희망 기간
	hasExperience: boolean;
	hasOtherPets: boolean;
	homeType: "house" | "apartment";
}

// 임시 보호 중인 강아지 타입 정의
interface FosterDog {
	id: string;
	name: string;
	image: string;
	age: string;
	gender: "male" | "female";
	breed: string;
	fosterName: string;
	startDate: Date;
	endDate: Date;
	status: "active" | "completed" | "extended";
	daysLeft?: number;
}

// 더미 임시 보호 신청 데이터
const dummyRequests: FosterRequest[] = [
	{
		id: "fr1",
		dogName: "달이",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog5",
		applicantName: "정다은",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user5&backgroundColor=d1bcf5",
		date: new Date("2023-05-18"),
		status: "pending",
		message:
			"한 달 정도 임시보호가 가능합니다. 반려동물을 키워본 경험이 있고, 재택근무를 하고 있어 돌봄이 가능합니다.",
		phone: "010-5678-1234",
		address: "서울시 송파구 올림픽로 135",
		fosterPeriod: "1개월",
		hasExperience: true,
		hasOtherPets: false,
		homeType: "apartment",
	},
	{
		id: "fr2",
		dogName: "콩이",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog6",
		applicantName: "김현우",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user6&backgroundColor=b2e0fa",
		date: new Date("2023-05-17"),
		status: "approved",
		message:
			"2주 정도 임시보호 가능합니다. 현재 반려견 한 마리와 함께 살고 있어요.",
		phone: "010-6789-2345",
		address: "경기도 성남시 분당구 판교역로 235",
		fosterPeriod: "2주",
		hasExperience: true,
		hasOtherPets: true,
		homeType: "apartment",
	},
	{
		id: "fr3",
		dogName: "보리",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog7",
		applicantName: "이지은",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user7&backgroundColor=fadab2",
		date: new Date("2023-05-16"),
		status: "rejected",
		message:
			"3개월 정도 임시보호 가능합니다. 넓은 마당이 있는 주택에 살고 있습니다.",
		phone: "010-7890-3456",
		address: "경기도 용인시 수지구 죽전로 152",
		fosterPeriod: "3개월",
		hasExperience: false,
		hasOtherPets: false,
		homeType: "house",
	},
	{
		id: "fr4",
		dogName: "하루",
		dogImage: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog8",
		applicantName: "박서준",
		applicantImage:
			"https://api.dicebear.com/7.x/notionists/svg?seed=user8&backgroundColor=b2fad2",
		date: new Date("2023-05-15"),
		status: "pending",
		message:
			"1개월 임시보호 신청합니다. 현재 고양이 2마리와 함께 살고 있습니다.",
		phone: "010-8901-4567",
		address: "서울시 마포구 와우산로 94",
		fosterPeriod: "1개월",
		hasExperience: true,
		hasOtherPets: true,
		homeType: "apartment",
	},
];

// 더미 임시 보호 중인 강아지 데이터
const dummyFosterDogs: FosterDog[] = [
	{
		id: "fd1",
		name: "콩이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog6&backgroundColor=b2e0fa",
		age: "1살",
		gender: "male",
		breed: "비글",
		fosterName: "김현우",
		startDate: new Date("2023-05-20"),
		endDate: new Date("2023-06-03"),
		status: "active",
		daysLeft: 5,
	},
	{
		id: "fd2",
		name: "쿠키",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog9&backgroundColor=fad2b2",
		age: "3살",
		gender: "female",
		breed: "코커스패니얼",
		fosterName: "이지민",
		startDate: new Date("2023-05-10"),
		endDate: new Date("2023-06-10"),
		status: "active",
		daysLeft: 12,
	},
	{
		id: "fd3",
		name: "삐삐",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog10&backgroundColor=d2b2fa",
		age: "2살",
		gender: "female",
		breed: "시츄",
		fosterName: "최재현",
		startDate: new Date("2023-05-05"),
		endDate: new Date("2023-06-05"),
		status: "active",
		daysLeft: 7,
	},
	{
		id: "fd4",
		name: "토리",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog11&backgroundColor=b2fad2",
		age: "4살",
		gender: "male",
		breed: "포메라니안",
		fosterName: "황선영",
		startDate: new Date("2023-04-15"),
		endDate: new Date("2023-05-15"),
		status: "completed",
	},
	{
		id: "fd5",
		name: "몽이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog12&backgroundColor=b2d9fa",
		age: "1살",
		gender: "male",
		breed: "진돗개",
		fosterName: "박은지",
		startDate: new Date("2023-04-20"),
		endDate: new Date("2023-05-20"),
		status: "extended",
	},
];

export default function FosterManagerMainPage() {
	const { selectedCenter } = useCenterStore();
	const [filter, setFilter] = useState<
		"all" | "pending" | "approved" | "rejected"
	>("all");
	const [dogFilter, setDogFilter] = useState<
		"all" | "active" | "completed" | "extended"
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
		activeFoster: dummyFosterDogs.filter((dog) => dog.status === "active")
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

	// 필터링된 임시 보호 강아지 목록
	const filteredFosterDogs = dummyFosterDogs.filter((dog) => {
		// 상태 필터링
		if (dogFilter !== "all" && dog.status !== dogFilter) return false;

		// 검색어 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				dog.name.toLowerCase().includes(query) ||
				dog.fosterName.toLowerCase().includes(query)
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
						<PawPrint className="w-5 h-5 mr-2 text-orange-600" />
						임시보호 관리
					</h1>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 임시보호 신청
						및 현황을 관리하세요
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
						<span className="text-xs text-gray-500">전체 신청</span>
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
							className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
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
									다른 반려동물 있음
								</button>
								<button
									type="button"
									className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
								>
									1개월 이상
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
							</div>
							<div className="flex justify-end mt-3">
								<button
									type="button"
									className="text-sm text-orange-600 font-medium"
								>
									필터 초기화
								</button>
							</div>
						</div>
					</motion.div>
				)}

				{/* 임시보호 만료 예정 알림 */}
				<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
					<div className="flex justify-between items-center mb-3">
						<h2 className="font-semibold text-gray-800 flex items-center">
							<Clock3 className="w-4 h-4 mr-2 text-orange-600" />
							임시보호 만료 예정
						</h2>
						<button
							type="button"
							className="text-xs text-orange-600"
						>
							전체보기
						</button>
					</div>

					{dummyFosterDogs.filter(
						(dog) =>
							dog.status === "active" &&
							dog.daysLeft &&
							dog.daysLeft <= 7,
					).length === 0 ? (
						<p className="text-center py-3 text-gray-400 text-sm">
							7일 이내 만료 예정인 임시보호가 없습니다
						</p>
					) : (
						<div className="space-y-2">
							{dummyFosterDogs
								.filter(
									(dog) =>
										dog.status === "active" &&
										dog.daysLeft &&
										dog.daysLeft <= 7,
								)
								.map((dog) => (
									<div
										key={dog.id}
										className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
									>
										<div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
											<img
												src={dog.image}
												alt={dog.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-grow">
											<p className="text-sm font-medium">
												{dog.name} ({dog.fosterName}님
												임시보호)
											</p>
											<p className="text-xs text-gray-500">
												{format(
													dog.endDate,
													"MM월 dd일",
													{ locale: ko },
												)}{" "}
												만료 ({dog.daysLeft}일 남음)
											</p>
										</div>
										<button
											type="button"
											className="px-3 py-1 bg-white text-orange-600 text-xs font-medium rounded-full shadow-sm"
										>
											연장 안내
										</button>
									</div>
								))}
						</div>
					)}
				</div>

				{/* 임시 보호 신청 목록 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						임시보호 신청 목록
					</h2>
					<div className="space-y-3">
						{filteredRequests.length === 0 ? (
							<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
								임시보호 신청 내역이 없습니다
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
															임시보호 신청 •{" "}
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
															임시보호 희망기간
														</p>
														<p className="font-medium">
															{
																request.fosterPeriod
															}
														</p>
													</div>
													<div>
														<p className="text-gray-500">
															경험 여부
														</p>
														<p className="font-medium">
															{request.hasExperience
																? "있음"
																: "없음"}
														</p>
													</div>
													<div>
														<p className="text-gray-500">
															다른 반려동물
														</p>
														<p className="font-medium">
															{request.hasOtherPets
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
															className="px-4 py-1.5 text-sm bg-orange-600 text-white rounded-lg"
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

				{/* 임시 보호 중인 강아지 목록 */}
				<div>
					<div className="flex justify-between items-center mb-3">
						<h2 className="text-lg font-bold text-gray-800">
							임시보호 중인 강아지
						</h2>
						<div className="flex gap-1">
							<button
								type="button"
								className={`text-xs px-2 py-0.5 rounded-full ${dogFilter === "all" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}
								onClick={() => setDogFilter("all")}
							>
								전체
							</button>
							<button
								type="button"
								className={`text-xs px-2 py-0.5 rounded-full ${dogFilter === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
								onClick={() => setDogFilter("active")}
							>
								진행중
							</button>
							<button
								type="button"
								className={`text-xs px-2 py-0.5 rounded-full ${dogFilter === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
								onClick={() => setDogFilter("completed")}
							>
								종료
							</button>
							<button
								type="button"
								className={`text-xs px-2 py-0.5 rounded-full ${dogFilter === "extended" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
								onClick={() => setDogFilter("extended")}
							>
								연장
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						{filteredFosterDogs.length === 0 ? (
							<p className="col-span-2 text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
								임시보호 중인 강아지가 없습니다
							</p>
						) : (
							filteredFosterDogs.map((dog) => (
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
										<div
											className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
												dog.status === "active"
													? "bg-green-100/80 text-green-700"
													: dog.status === "completed"
														? "bg-blue-100/80 text-blue-700"
														: "bg-purple-100/80 text-purple-700"
											} backdrop-blur-sm`}
										>
											{dog.status === "active" &&
												"진행중"}
											{dog.status === "completed" &&
												"완료"}
											{dog.status === "extended" &&
												"연장"}
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
										<p className="text-xs text-gray-500 flex items-center justify-between">
											<span>
												임시보호자: {dog.fosterName}
											</span>
											{dog.status === "active" &&
												dog.daysLeft !== undefined && (
													<span
														className={`font-medium ${dog.daysLeft <= 3 ? "text-red-500" : ""}`}
													>
														{dog.daysLeft}일 남음
													</span>
												)}
										</p>
										<div className="flex justify-between items-center mt-2">
											<span className="text-xs text-gray-500">
												{format(
													dog.startDate,
													"MM/dd",
													{ locale: ko },
												)}{" "}
												~{" "}
												{format(dog.endDate, "MM/dd", {
													locale: ko,
												})}
											</span>
											<button
												type="button"
												className="text-xs text-orange-600 font-medium"
											>
												상세 정보
											</button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* 임시보호 일정 캘린더 */}
				<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
					<div className="flex justify-between items-center mb-3">
						<h2 className="font-semibold text-gray-800 flex items-center">
							<Calendar className="w-4 h-4 mr-2 text-orange-600" />
							임시보호 일정
						</h2>
						<button
							type="button"
							className="text-xs text-orange-600"
						>
							전체보기
						</button>
					</div>
					<div className="bg-gray-50 p-3 rounded-lg text-center">
						<p className="text-sm text-gray-500">
							캘린더 위젯이 들어갈 자리입니다
						</p>
						<p className="text-xs text-gray-400 mt-1">
							실제 구현 시 FullCalendar 등의 라이브러리 사용
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

import { useState } from "react";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import {
	Check,
	X,
	ChevronDown,
	ChevronUp,
	Search,
	Filter,
	PawPrint,
	Clock3,
} from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { Input } from "@/components/ui/input";
import DogCard from "@/components/common/DogCard";

// 임시보호 중인 강아지 타입 정의
interface FosterDog {
	id: string;
	name: string;
	image: string;
	breed: string;
	age: string;
	gender: "male" | "female";
	status: "active" | "completed" | "extended";
	fosterName: string;
	startDate: Date;
	endDate: Date;
	daysLeft?: number;
}

// 임시보호 신청 타입 정의
interface FosterApplicant {
	id: string;
	name: string;
	image: string;
	date: Date;
	status: "pending" | "approved" | "rejected";
	phone: string;
	fosterPeriod: string;
	hasExperience: boolean;
	hasOtherPets: boolean;
	homeType: "house" | "apartment";
	address: string;
	message: string;
}

// 임시보호 신청 강아지 타입 정의
interface FosterRequestDog {
	id: string;
	name: string;
	image: string;
	breed: string;
	age: string;
	gender: "male" | "female";
	applicants: FosterApplicant[];
}

// 임시보호 중인 더미 데이터 (DogCard용)
const dummyFosterInProgressDogs = [
	{
		dogId: 101,
		name: "몽실이",
		ageMonth: "24",
		imageUrl:
			"https://api.dicebear.com/7.x/lorelei/svg?seed=dog1&backgroundColor=b6e3f4",
		gender: "FEMALE" as const,
		isFavorite: false,
		fosterParent: "김민수",
		endDate: addDays(new Date(), 5),
		daysLeft: 5,
	},
	{
		dogId: 102,
		name: "초코",
		ageMonth: "36",
		imageUrl:
			"https://api.dicebear.com/7.x/lorelei/svg?seed=dog2&backgroundColor=f4cab6",
		gender: "MALE" as const,
		isFavorite: true,
		fosterParent: "이지영",
		endDate: addDays(new Date(), 15),
		daysLeft: 15,
	},
	{
		dogId: 103,
		name: "해피",
		ageMonth: "12",
		imageUrl:
			"https://api.dicebear.com/7.x/lorelei/svg?seed=dog3&backgroundColor=c0aede",
		gender: "MALE" as const,
		isFavorite: false,
		fosterParent: "박준호",
		endDate: addDays(new Date(), 2),
		daysLeft: 2,
	},
	{
		dogId: 104,
		name: "루시",
		ageMonth: "60",
		imageUrl:
			"https://api.dicebear.com/7.x/lorelei/svg?seed=dog4&backgroundColor=ffdfbf",
		gender: "FEMALE" as const,
		isFavorite: true,
		fosterParent: "최지원",
		endDate: addDays(new Date(), 30),
		daysLeft: 30,
	},
];

// 더미 임시보호 중인 강아지 데이터
const dummyFosterDogs: FosterDog[] = [
	{
		id: "dog1",
		name: "몽실이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog1&backgroundColor=b6e3f4",
		breed: "말티즈",
		age: "2살",
		gender: "female",
		status: "active",
		fosterName: "김민수",
		startDate: addDays(new Date(), -30),
		endDate: addDays(new Date(), 5),
		daysLeft: 5,
	},
	{
		id: "dog2",
		name: "초코",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog2&backgroundColor=f4cab6",
		breed: "푸들",
		age: "3살",
		gender: "male",
		status: "active",
		fosterName: "이지영",
		startDate: addDays(new Date(), -15),
		endDate: addDays(new Date(), 15),
		daysLeft: 15,
	},
	{
		id: "dog3",
		name: "해피",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog3&backgroundColor=c0aede",
		breed: "비숑 프리제",
		age: "1살",
		gender: "male",
		status: "active",
		fosterName: "박준호",
		startDate: addDays(new Date(), -10),
		endDate: addDays(new Date(), 2),
		daysLeft: 2,
	},
	{
		id: "dog4",
		name: "루시",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog4&backgroundColor=ffdfbf",
		breed: "시바견",
		age: "5살",
		gender: "female",
		status: "extended",
		fosterName: "최지원",
		startDate: addDays(new Date(), -60),
		endDate: addDays(new Date(), 30),
		daysLeft: 30,
	},
	{
		id: "dog5",
		name: "코코",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog5&backgroundColor=c6f4bf",
		breed: "웰시코기",
		age: "2살",
		gender: "male",
		status: "completed",
		fosterName: "정다현",
		startDate: addDays(new Date(), -90),
		endDate: addDays(new Date(), -10),
	},
	{
		id: "dog6",
		name: "댕댕이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog6&backgroundColor=bfd2f4",
		breed: "포메라니안",
		age: "3살",
		gender: "female",
		status: "active",
		fosterName: "송민재",
		startDate: addDays(new Date(), -5),
		endDate: addDays(new Date(), 25),
		daysLeft: 25,
	},
	{
		id: "dog7",
		name: "모카",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog7&backgroundColor=f4bfec",
		breed: "닥스훈트",
		age: "4살",
		gender: "male",
		status: "extended",
		fosterName: "이서연",
		startDate: addDays(new Date(), -45),
		endDate: addDays(new Date(), 45),
		daysLeft: 45,
	},
];

// 더미 임시보호 신청 강아지 데이터
const dummyFosterRequestDogs: FosterRequestDog[] = [
	{
		id: "dog8",
		name: "바둑이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog8&backgroundColor=f7e3bf",
		breed: "믹스견",
		age: "2살",
		gender: "male",
		applicants: [
			{
				id: "req1",
				name: "김철수",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
				date: addDays(new Date(), -5),
				status: "pending",
				phone: "010-1234-5678",
				fosterPeriod: "1개월",
				hasExperience: true,
				hasOtherPets: false,
				homeType: "apartment",
				address: "서울시 강남구 테헤란로 123",
				message:
					"강아지를 정말 좋아하고 책임감 있게 돌볼 자신이 있습니다. 주말에는 공원에서 산책도 자주 시켜줄 수 있어요.",
			},
			{
				id: "req6",
				name: "박지수",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user6",
				date: addDays(new Date(), -4),
				status: "pending",
				phone: "010-8765-4321",
				fosterPeriod: "2개월",
				hasExperience: true,
				hasOtherPets: true,
				homeType: "house",
				address: "서울시 서초구 서초대로 456",
				message:
					"반려동물을 키운 경험이 많습니다. 넓은 마당이 있어 충분한 활동공간을 제공할 수 있어요.",
			},
		],
	},
	{
		id: "dog9",
		name: "달이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog9&backgroundColor=bfe3f4",
		breed: "말티즈",
		age: "3살",
		gender: "female",
		applicants: [
			{
				id: "req2",
				name: "이영희",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
				date: addDays(new Date(), -3),
				status: "pending",
				phone: "010-2345-6789",
				fosterPeriod: "2개월",
				hasExperience: false,
				hasOtherPets: true,
				homeType: "house",
				address: "경기도 성남시 분당구 판교로 456",
				message:
					"처음으로 임시보호를 해보려고 합니다. 다른 반려동물과도 잘 지낼 수 있는 강아지였으면 좋겠어요.",
			},
		],
	},
	{
		id: "dog10",
		name: "짱구",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog10&backgroundColor=f0c6de",
		breed: "비숑",
		age: "1살",
		gender: "male",
		applicants: [
			{
				id: "req3",
				name: "박민수",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
				date: addDays(new Date(), -7),
				status: "approved",
				phone: "010-3456-7890",
				fosterPeriod: "3개월",
				hasExperience: true,
				hasOtherPets: true,
				homeType: "apartment",
				address: "서울시 송파구 올림픽로 789",
				message:
					"이전에도 임시보호 경험이 있어요. 집에 고양이도 있는데 강아지와 잘 지내는 편입니다.",
			},
		],
	},
	{
		id: "dog11",
		name: "사랑이",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog11&backgroundColor=d4f7bf",
		breed: "푸들",
		age: "2살",
		gender: "female",
		applicants: [
			{
				id: "req4",
				name: "최유진",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
				date: addDays(new Date(), -10),
				status: "rejected",
				phone: "010-4567-8901",
				fosterPeriod: "1개월",
				hasExperience: false,
				hasOtherPets: false,
				homeType: "house",
				address: "인천시 연수구 컨벤시아대로 101",
				message:
					"가족들 모두 강아지를 좋아하고 넓은 마당이 있는 주택에 살고 있어요. 충분한 산책과 놀이 시간을 제공할 수 있습니다.",
			},
		],
	},
	{
		id: "dog12",
		name: "호두",
		image: "https://api.dicebear.com/7.x/lorelei/svg?seed=dog12&backgroundColor=e0c6f4",
		breed: "시츄",
		age: "5살",
		gender: "male",
		applicants: [
			{
				id: "req5",
				name: "정수아",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user5",
				date: addDays(new Date(), -2),
				status: "pending",
				phone: "010-5678-9012",
				fosterPeriod: "2개월",
				hasExperience: true,
				hasOtherPets: false,
				homeType: "apartment",
				address: "서울시 마포구 월드컵로 202",
				message:
					"반려동물 관련 직종에서 일하고 있어서 강아지 케어에 자신이 있습니다. 최대한 많은 시간을 함께 보낼 수 있어요.",
			},
			{
				id: "req7",
				name: "김태희",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user7",
				date: addDays(new Date(), -1),
				status: "pending",
				phone: "010-9876-5432",
				fosterPeriod: "3개월",
				hasExperience: false,
				hasOtherPets: false,
				homeType: "apartment",
				address: "서울시 중구 을지로 123",
				message:
					"강아지를 좋아하고 책임감 있게 돌볼 자신이 있습니다. 매일 산책을 시켜줄 수 있어요.",
			},
			{
				id: "req8",
				name: "이준호",
				image: "https://api.dicebear.com/7.x/personas/svg?seed=user8",
				date: addDays(new Date(), -3),
				status: "pending",
				phone: "010-1357-2468",
				fosterPeriod: "1개월",
				hasExperience: true,
				hasOtherPets: true,
				homeType: "house",
				address: "경기도 고양시 일산동구 중앙로 789",
				message:
					"반려동물 관련 경험이 많고, 다른 고양이와 함께 잘 지낼 수 있습니다.",
			},
		],
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
	const [expandedDogId, setExpandedDogId] = useState<string | null>(null);
	const [expandedApplicantId, setExpandedApplicantId] = useState<
		string | null
	>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [tab, setTab] = useState<"pending" | "fostered">("pending");

	// 강아지 카드 확장/축소 토글
	const toggleDog = (id: string) => {
		if (expandedDogId === id) {
			setExpandedDogId(null);
		} else {
			setExpandedDogId(id);
			setExpandedApplicantId(null);
		}
	};

	// 신청자 상세정보 확장/축소 토글
	const toggleApplicant = (id: string) => {
		if (expandedApplicantId === id) {
			setExpandedApplicantId(null);
		} else {
			setExpandedApplicantId(id);
		}
	};

	// 신청 승인/거절 처리
	const handleRequestAction = (
		applicantId: string,
		action: "approved" | "rejected",
	) => {
		// 실제로는 API 호출하여 상태 업데이트
		console.log(
			`${action === "approved" ? "승인" : "거절"} 처리: ${applicantId}`,
		);

		// 여기서는 더미 데이터를 직접 수정하지 않음
		// 실제 구현 시에는 API 호출 후 상태 업데이트
	};

	// 임시보호 신청 강아지 필터링
	const filteredFosterRequestDogs = dummyFosterRequestDogs
		.filter((dog) => {
			// 검색어 필터
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				return (
					dog.name.toLowerCase().includes(query) ||
					dog.breed.toLowerCase().includes(query) ||
					dog.applicants.some((app) =>
						app.name.toLowerCase().includes(query),
					)
				);
			}
			return true;
		})
		.map((dog) => ({
			...dog,
			applicants: dog.applicants.filter((applicant) => {
				// 상태 필터
				if (filter !== "all" && applicant.status !== filter)
					return false;
				return true;
			}),
		}))
		.filter((dog) => dog.applicants.length > 0);

	// 임시보호 중인 강아지 필터링
	const filteredFosterDogs = dummyFosterDogs.filter((dog) => {
		// 상태 필터
		if (dogFilter !== "all" && dog.status !== dogFilter) return false;

		// 검색어 필터
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				dog.name.toLowerCase().includes(query) ||
				dog.fosterName.toLowerCase().includes(query) ||
				dog.breed.toLowerCase().includes(query)
			);
		}
		return true;
	});

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold text-gray-800 mb-1 flex items-center">
						<PawPrint className="w-5 h-5 mr-2 text-orange-600" />
						임시보호 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 임시보호 신청
						및 현황을 관리하세요
					</p>
				</div>
			</div>
			{/* 임시보호 만료 예정 알림 */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
				<div className="flex justify-between items-center mb-3">
					<h2 className="font-semibold text-gray-800 flex items-center">
						<Clock3 className="w-4 h-4 mr-2 text-orange-600" />
						임시보호 만료 예정
					</h2>
					<button type="button" className="text-xs text-orange-600">
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
											{format(dog.endDate, "MM월 dd일", {
												locale: ko,
											})}{" "}
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

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 상태 카드 */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="flex border-b">
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center ${
								tab === "pending"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("pending")}
						>
							신청 대기 중
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center ${
								tab === "fostered"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("fostered")}
						>
							임시보호 중
						</button>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="flex gap-2">
					<div className="relative flex-1">
						<input
							type="text"
							className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
							placeholder={
								tab === "pending"
									? "강아지 또는 신청자 이름으로 검색"
									: "강아지 또는 보호자 이름으로 검색"
							}
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

				{/* 임시보호 신청 목록 - 대기 중 탭 */}
				{tab === "pending" && (
					<div>
						<h2 className="text-lg font-bold text-gray-800 mb-3">
							임시보호 신청 목록
						</h2>
						<div className="space-y-3">
							{filteredFosterRequestDogs.length === 0 ? (
								<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
									임시보호 신청 내역이 없습니다
								</p>
							) : (
								filteredFosterRequestDogs.map((dog) => (
									<div
										key={dog.id}
										className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
									>
										<div
											className="p-4 cursor-pointer flex items-center"
											onClick={() => toggleDog(dog.id)}
											onKeyDown={(e) =>
												e.key === "Enter" &&
												toggleDog(dog.id)
											}
										>
											<div className="flex-shrink-0 mr-3">
												<img
													src={dog.image}
													alt={dog.name}
													className="w-14 h-14 rounded-lg object-cover border border-gray-200"
												/>
											</div>

											<div className="flex-1">
												<div className="flex justify-between items-center">
													<div>
														<h3 className="font-medium text-gray-800">
															{dog.name}
														</h3>
														<p className="text-xs text-gray-500 mt-0.5">
															{dog.breed} •{" "}
															{dog.age} •{" "}
															{dog.gender ===
															"male"
																? "남아"
																: "여아"}
														</p>
													</div>

													<div className="flex items-center">
														<div className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full mr-2">
															신청{" "}
															{
																dog.applicants
																	.length
															}
															건
														</div>
														{expandedDogId ===
														dog.id ? (
															<ChevronUp className="w-5 h-5 text-gray-400" />
														) : (
															<ChevronDown className="w-5 h-5 text-gray-400" />
														)}
													</div>
												</div>
											</div>
										</div>

										{/* 강아지별 신청자 목록 */}
										{expandedDogId === dog.id && (
											<div className="pt-2 px-4 pb-4 border-t border-gray-100 animate-fadeIn">
												<h4 className="text-sm font-medium text-gray-700 mb-2">
													신청자 목록
												</h4>
												<div className="space-y-2">
													{dog.applicants.map(
														(applicant) => (
															<div
																key={
																	applicant.id
																}
																className="bg-gray-50 rounded-lg p-3"
															>
																<Input
																	className="flex items-center justify-between cursor-pointer"
																	onClick={() =>
																		toggleApplicant(
																			applicant.id,
																		)
																	}
																	onKeyDown={(
																		e,
																	) => {
																		if (
																			e.key ===
																				"Enter" ||
																			e.key ===
																				" "
																		) {
																			toggleApplicant(
																				applicant.id,
																			);
																		}
																	}}
																	type="button"
																	tabIndex={0}
																>
																	<div className="flex items-center">
																		<img
																			src={
																				applicant.image
																			}
																			alt={
																				applicant.name
																			}
																			className="w-8 h-8 rounded-full mr-2"
																		/>
																		<div>
																			<div className="flex items-center">
																				<p className="font-medium text-sm">
																					{
																						applicant.name
																					}
																				</p>
																				<span
																					className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
																						applicant.status ===
																						"pending"
																							? "bg-amber-100 text-amber-700"
																							: applicant.status ===
																									"approved"
																								? "bg-green-100 text-green-700"
																								: "bg-red-100 text-red-700"
																					}`}
																				>
																					{applicant.status ===
																					"pending"
																						? "대기중"
																						: applicant.status ===
																								"approved"
																							? "승인됨"
																							: "거절됨"}
																				</span>
																			</div>
																			<p className="text-xs text-gray-500">
																				{format(
																					applicant.date,
																					"MM월 dd일",
																					{
																						locale: ko,
																					},
																				)}
																			</p>
																		</div>
																	</div>

																	<div className="flex items-center">
																		{applicant.status ===
																			"pending" && (
																			<>
																				<button
																					type="button"
																					className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						handleRequestAction(
																							applicant.id,
																							"approved",
																						);
																					}}
																					aria-label="승인"
																				>
																					<Check className="w-4 h-4" />
																				</button>
																				<button
																					type="button"
																					className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 ml-1"
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						handleRequestAction(
																							applicant.id,
																							"rejected",
																						);
																					}}
																					aria-label="거절"
																				>
																					<X className="w-4 h-4" />
																				</button>
																			</>
																		)}
																		{expandedApplicantId ===
																		applicant.id ? (
																			<ChevronUp className="w-5 h-5 text-gray-400 ml-2" />
																		) : (
																			<ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
																		)}
																	</div>
																</Input>

																{/* 신청자 상세 정보 */}
																{expandedApplicantId ===
																	applicant.id && (
																	<div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
																		<p className="text-sm text-gray-700 bg-white p-3 rounded-md mb-3">
																			{
																				applicant.message
																			}
																		</p>
																		<div className="grid grid-cols-2 gap-2 text-xs">
																			<div>
																				<p className="text-gray-500">
																					연락처
																				</p>
																				<p className="font-medium">
																					{
																						applicant.phone
																					}
																				</p>
																			</div>
																			<div>
																				<p className="text-gray-500">
																					임시보호
																					희망기간
																				</p>
																				<p className="font-medium">
																					{
																						applicant.fosterPeriod
																					}
																				</p>
																			</div>
																			<div>
																				<p className="text-gray-500">
																					경험
																					여부
																				</p>
																				<p className="font-medium">
																					{applicant.hasExperience
																						? "있음"
																						: "없음"}
																				</p>
																			</div>
																			<div>
																				<p className="text-gray-500">
																					다른
																					반려동물
																				</p>
																				<p className="font-medium">
																					{applicant.hasOtherPets
																						? "있음"
																						: "없음"}
																				</p>
																			</div>
																			<div>
																				<p className="text-gray-500">
																					주거
																					형태
																				</p>
																				<p className="font-medium">
																					{applicant.homeType ===
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
																				{
																					applicant.address
																				}
																			</p>
																		</div>

																		{applicant.status ===
																			"pending" && (
																			<div className="flex justify-end gap-2 mt-3">
																				<button
																					type="button"
																					className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg"
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						handleRequestAction(
																							applicant.id,
																							"rejected",
																						);
																					}}
																				>
																					거절하기
																				</button>
																				<button
																					type="button"
																					className="px-4 py-1.5 text-sm bg-orange-600 text-white rounded-lg"
																					onClick={(
																						e,
																					) => {
																						e.stopPropagation();
																						handleRequestAction(
																							applicant.id,
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
														),
													)}
												</div>
											</div>
										)}
									</div>
								))
							)}
						</div>
					</div>
				)}

				{/* 임시보호 중인 강아지 목록 - 임시보호 중 탭 */}
				{tab === "fostered" && (
					<div>
						<h2 className="text-lg font-bold text-gray-800 mb-3">
							임시보호 중인 강아지
						</h2>
						<div className="grid grid-cols-2 gap-3">
							{dummyFosterInProgressDogs.map((dog) => (
								<div key={dog.dogId} className="relative">
									<DogCard
										dogId={dog.dogId}
										name={dog.name}
										ageMonth={dog.ageMonth}
										imageUrl={dog.imageUrl}
										gender={dog.gender}
										isFavorite={dog.isFavorite}
									/>
									<div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100/90 text-green-700 backdrop-blur-sm">
										{dog.daysLeft}일 남음
									</div>
									<div className="absolute bottom-14 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-2 flex justify-start">
										<span className="text-xs text-white">
											{dog.fosterParent}님 보호 중
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

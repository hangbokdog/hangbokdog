import { useState, useRef, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, X, Search, Home, Loader2 } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAdoptionApplicationsAPI } from "@/api/adoption";

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
	const [tab, setTab] = useState<"pending" | "adopted">("pending");
	const [expandedRequestId, setExpandedRequestId] = useState<number | null>(
		null,
	);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const {
		data: adoptionApplications,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: [
			"adoptionApplications",
			selectedCenter?.centerId,
			searchQuery,
		],
		queryFn: ({ pageParam }) =>
			fetchAdoptionApplicationsAPI(
				Number(selectedCenter?.centerId),
				pageParam || "",
			),
		getNextPageParam: (lastPage) => lastPage.pageToken || undefined,
		initialPageParam: "",
		enabled: !!selectedCenter?.centerId && tab === "pending",
	});

	// 모든 입양 신청을 하나의 배열로 변환
	const allApplications =
		adoptionApplications?.pages.flatMap((page) =>
			Array.isArray(page.data) ? page.data : [],
		) || [];

	// 검색 필터링
	const filteredApplications = allApplications.filter((app) => {
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				app.dogName.toLowerCase().includes(query) ||
				app.memberName.toLowerCase().includes(query)
			);
		}
		return true;
	});

	const toggleRequest = (id: number) => {
		if (expandedRequestId === id) {
			setExpandedRequestId(null);
		} else {
			setExpandedRequestId(id);
		}
	};

	const handleRequestAction = (
		id: number,
		action: "approved" | "rejected",
	) => {
		console.log(`${action === "approved" ? "승인" : "거절"} 처리: ${id}`);
	};

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	// Intersection Observer 설정
	useEffect(() => {
		const observer = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "20px",
			threshold: 0.1,
		});

		const currentLoadMoreRef = loadMoreRef.current;
		if (currentLoadMoreRef) {
			observer.observe(currentLoadMoreRef);
		}

		return () => {
			if (currentLoadMoreRef) {
				observer.unobserve(currentLoadMoreRef);
			}
			observer.disconnect();
		};
	}, [handleObserver]);

	return (
		<div className="flex flex-col h-full bg-gray-50 pb-16">
			{/* 헤더 */}
			<div className="bg-white shadow-sm p-4 sticky top-0 z-10">
				<div className="max-w-lg mx-auto">
					<div className="text-xl font-bold text-gray-800 mb-1 flex items-center">
						<Home className="w-5 h-5 mr-2 text-blue-600" />
						입양 관리
					</div>
					<p className="text-sm text-gray-600">
						{selectedCenter?.centerName || "센터"}의 입양 신청
						내역을 관리하세요
					</p>
				</div>
			</div>

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 탭 */}
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
							대기 중
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center ${
								tab === "adopted"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("adopted")}
						>
							입양 중
						</button>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="relative">
					<input
						type="text"
						className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
						placeholder="강아지 또는 신청자 이름으로 검색"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				</div>

				{/* 입양 신청 목록 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						{tab === "pending"
							? "입양 신청 목록"
							: "입양 중인 목록"}
					</h2>

					{/* 대기 중 탭 */}
					{tab === "pending" && isLoading ? (
						// 로딩 상태
						<div className="py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
							<Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
							<p className="text-gray-500">
								데이터를 불러오는 중입니다...
							</p>
						</div>
					) : filteredApplications.length === 0 ? (
						// 빈 상태
						<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
							입양 신청 내역이 없습니다
						</p>
					) : (
						// 입양 신청 목록
						<div className="space-y-3">
							{filteredApplications.map((application) => (
								<div
									key={application.adoptionId}
									className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
								>
									<button
										type="button"
										className="w-full p-4 cursor-pointer"
										onClick={() =>
											toggleRequest(
												application.adoptionId,
											)
										}
									>
										<div className="flex items-center gap-3">
											<div className="relative">
												<img
													src={
														application.dogImage ||
														"https://api.dicebear.com/7.x/lorelei/svg?seed=default"
													}
													alt={application.dogName}
													className="w-12 h-12 rounded-lg object-cover border border-gray-200"
												/>
											</div>

											<div className="flex-1">
												<div className="flex justify-between items-start">
													<div>
														<div className="flex items-center gap-2">
															<h3 className="font-medium text-gray-800">
																{
																	application.memberName
																}
															</h3>
														</div>
														<p className="text-xs text-gray-500 mt-0.5">
															{
																application.dogName
															}{" "}
															입양 신청 •{" "}
															{format(
																parseISO(
																	application.created_at,
																),
																"MM월 dd일",
																{
																	locale: ko,
																},
															)}
														</p>
													</div>

													<div className="flex items-center">
														<button
															type="button"
															className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 mr-1"
															onClick={(e) => {
																e.stopPropagation();
																handleRequestAction(
																	application.adoptionId,
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
															onClick={(e) => {
																e.stopPropagation();
																handleRequestAction(
																	application.adoptionId,
																	"rejected",
																);
															}}
															aria-label="거절"
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												</div>
											</div>
										</div>
									</button>
								</div>
							))}

							{/* 무한 스크롤 로딩 관련 요소 */}
							{hasNextPage && (
								<div
									ref={loadMoreRef}
									className="py-4 flex justify-center"
								>
									{isFetchingNextPage ? (
										<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
									) : (
										<p className="text-sm text-gray-400">
											스크롤하여 더 불러오기
										</p>
									)}
								</div>
							)}
						</div>
					)}

					{/* 입양 중 탭 (API 없음 - UI만 구현) */}
					{tab === "adopted" && (
						<div className="py-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
							<p className="text-gray-500 mb-2">
								입양 중인 목록을 불러올 수 없습니다.
							</p>
							<p className="text-sm text-gray-400">
								해당 데이터는 현재 준비 중입니다.
							</p>
						</div>
					)}
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

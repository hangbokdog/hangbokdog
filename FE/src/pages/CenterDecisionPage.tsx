import CenterDecisionListItem from "@/components/common/CenterDecisionListItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import {
	fetchCenters,
	fetchMyCenters,
	fetchMyJoinRequestCenters,
	createCenter,
	fetchExistingCenterCities,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { locations, LocationLabel, type Location } from "@/types/center";
import {
	BuildingIcon,
	Search as SearchIcon,
	Clock,
	Plus,
	MapPinIcon,
	CompassIcon,
	ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Types
interface CenterResponseData {
	centerId: string;
	centerName: string;
	status: string;
	centerJoinRequestId?: string;
	address?: string;
}

interface MyCenterResponseData {
	centerId: string;
	centerName: string;
	centerGrade: string;
	address?: string;
}

interface MyJoinRequestCenterResponseData {
	centerId: string;
	centerName: string;
	centerJoinRequestId: string;
	address?: string;
}

interface CenterCityData {
	count: number;
	centerCity: Location;
}

interface SearchCenterCityData {
	centerJoinRequestId: string | null;
	centerId: number;
	centerName: string;
	centerCity: Location;
	status: string;
}

// Debounce search function
const debouncedSearch = debounce((val: string, setter: (s: string) => void) => {
	setter(val);
}, 300);

const cityGroups = {
	수도권: [
		"SEOUL",
		"INCHEON",
		"GYEONGGI",
		"SUWON",
		"SEONGNAM",
		"GOYANG",
		"YONGIN",
		"BUCHEON",
		"ANYANG",
		"NAMYANGJU",
		"HWASEONG",
		"UIJEONGBU",
		"SIHEUNG",
		"PYEONGTAEK",
		"GIMPO",
		"GWANGMYEONG",
		"GURI",
		"OSAN",
		"GUNPO",
		"UIWANG",
		"HANAM",
		"ICHON",
		"ANSEONG",
		"POCHEON",
		"YANGJU",
		"DONGDUCHEON",
		"PAJU",
	],
	강원권: [
		"GANGWON",
		"CHUNCHEON",
		"WONJU",
		"GANGNEUNG",
		"DONGHAE",
		"TAEBAEK",
		"SOKCHO",
		"SAMCHEOK",
	],
	충청권: [
		"CHUNGBUK",
		"CHUNGNAM",
		"DAEJEON",
		"SEJONG",
		"CHEONGJU",
		"CHUNGJU",
		"JECHEON",
		"CHEONAN",
		"GONGJU",
		"ASAN",
		"BORYEONG",
		"SEOSAN",
		"NONSAN",
		"GYERYONG",
	],
	전라권: [
		"JEONBUK",
		"JEONNAM",
		"GWANGJU",
		"JEONJU",
		"GUNSAN",
		"IKSAN",
		"NAMWON",
		"GIMJE",
		"MOKPO",
		"YEOSU",
		"SUNCHEON",
		"GWANGYANG",
		"NAJU",
	],
	경상권: [
		"GYEONGBUK",
		"GYEONGNAM",
		"DAEGU",
		"BUSAN",
		"ULSAN",
		"POHANG",
		"GUMI",
		"GYEONGJU",
		"ANDONG",
		"YEONGJU",
		"MUNGYEONG",
		"SANGJU",
		"YEONGCHEON",
		"CHANGWON",
		"JINJU",
		"TONGYEONG",
		"SACHEON",
		"GIMHAE",
		"MIRYANG",
		"YANGSAN",
	],
	제주권: ["JEJU", "SEOGWIPO"],
};

// 지역별 아이콘 (예시)
const cityIconMapping: { [key: string]: React.ReactNode } = {
	// 대표 도시들만 특별 아이콘 설정, 나머지는 DEFAULT 사용
	SEOUL: <BuildingIcon size={16} className="mr-1.5" />,
	BUSAN: <BuildingIcon size={16} className="mr-1.5" />,
	DAEGU: <BuildingIcon size={16} className="mr-1.5" />,
	INCHEON: <BuildingIcon size={16} className="mr-1.5" />,
	GWANGJU: <BuildingIcon size={16} className="mr-1.5" />,
	DAEJEON: <BuildingIcon size={16} className="mr-1.5" />,
	ULSAN: <BuildingIcon size={16} className="mr-1.5" />,
	SEJONG: <BuildingIcon size={16} className="mr-1.5" />,
	JEJU: <MapPinIcon size={16} className="mr-1.5" />,
	GYEONGGI: <MapPinIcon size={16} className="mr-1.5" />,
	GANGWON: <MapPinIcon size={16} className="mr-1.5" />,
	CHUNGBUK: <MapPinIcon size={16} className="mr-1.5" />,
	CHUNGNAM: <MapPinIcon size={16} className="mr-1.5" />,
	JEONBUK: <MapPinIcon size={16} className="mr-1.5" />,
	JEONNAM: <MapPinIcon size={16} className="mr-1.5" />,
	GYEONGBUK: <MapPinIcon size={16} className="mr-1.5" />,
	GYEONGNAM: <MapPinIcon size={16} className="mr-1.5" />,
	DEFAULT: <MapPinIcon size={16} className="mr-1.5" />,
};

export default function CenterDecisionPage() {
	const [query, setQuery] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [activeTab, setActiveTab] = useState<
		"search" | "joined" | "pending" | "explore"
	>("explore");
	const [selectedCity, setSelectedCity] = useState<string | null>(null);
	const [activeGroup, setActiveGroup] = useState<string | null>(null);
	const { selectedCenter, clearSelectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["centerSearch", query],
		queryFn: () => fetchCenters(query, null),
		enabled: query.length > 0,
		staleTime: 0,
	});

	const { data: myCenters, isLoading: isMycentersLoading } = useQuery({
		queryKey: ["myCenters", selectedCenter],
		queryFn: () => fetchMyCenters(),
		staleTime: 0,
	});

	const { data: myJoinRequestCenters, isLoading: isPendingLoading } =
		useQuery({
			queryKey: ["myJoinRequestCenters"],
			queryFn: () => fetchMyJoinRequestCenters(),
			staleTime: 0,
		});

	const { mutate: createCenterMutate } = useMutation({
		mutationKey: ["createCenter"],
		mutationFn: createCenter,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["myCenters"] });
			toast.success("테스트 센터가 생성되었습니다");
		},
		onError: () => {
			toast.error("센터 생성에 실패했습니다");
		},
	});

	const { data: existingCenterCities, isLoading: isCitiesLoading } = useQuery(
		{
			queryKey: ["centerCities"],
			queryFn: () => fetchExistingCenterCities(),
		},
	);

	const { data: cityResults, isLoading: isCityResultsLoading } = useQuery({
		queryKey: ["searchCenterCities", selectedCity],
		queryFn: () => fetchCenters(null, selectedCity),
		enabled: !!selectedCity,
		staleTime: 0,
	});

	const handleDummyCenterCreate = () => {
		createCenterMutate({
			name: "신청 확인용",
			sponsorAmount: 25000,
			centerCity: locations.SEOUL,
		});
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		debouncedSearch(value, setQuery);
	};

	useEffect(() => {
		clearSelectedCenter();
	}, [clearSelectedCenter]);

	// Count badge numbers
	const joinedCount = myCenters?.length || 0;
	const pendingCount = myJoinRequestCenters?.length || 0;

	const selectCity = (city: string) => {
		setSelectedCity(city);
	};

	// 지역 이름 포맷팅 함수 - LocationLabel 사용으로 수정
	const formatCityName = (cityCode: string): string => {
		return (
			LocationLabel[cityCode as keyof typeof LocationLabel] || cityCode
		);
	};

	// 지역 아이콘 가져오는 함수
	const getCityIcon = (cityCode: string): React.ReactNode => {
		return cityIconMapping[cityCode] || cityIconMapping.DEFAULT;
	};

	// 뒤로가기 버튼 클릭 핸들러 함수 추가
	const handleBackButton = () => {
		if (activeGroup) {
			setSelectedCity(null);
		} else {
			setSelectedCity(null);
			setActiveGroup(null);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
			{/* Header with welcome message */}
			<div className="text-gray-800 p-5 shadow-md">
				<div className="text-2xl font-bold mb-2">행복하개</div>
				<p className="text-blueGray text-sm">
					센터를 선택하고 더 많은 기능을 이용해보세요
				</p>
			</div>

			{/* Tab navigation */}
			<div className="flex bg-white shadow-sm sticky top-0 z-10 overflow-x-auto">
				<button
					type="button"
					onClick={() => {
						setActiveTab("explore");
						setSelectedCity(null);
						setActiveGroup(null);
					}}
					className={`flex-1 py-4 text-center text-sm font-medium relative whitespace-nowrap px-1 ${
						activeTab === "explore"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="flex items-center justify-center gap-1">
						<CompassIcon size={16} />
						지역 센터
					</span>
					{activeTab === "explore" && (
						<motion.div
							layoutId="activeTab"
							className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
						/>
					)}
				</button>

				<button
					type="button"
					onClick={() => setActiveTab("search")}
					className={`flex-1 py-4 text-center text-sm font-medium relative whitespace-nowrap px-1 ${
						activeTab === "search"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="flex items-center justify-center gap-1">
						<SearchIcon size={16} />
						센터 찾기
					</span>
					{activeTab === "search" && (
						<motion.div
							layoutId="activeTab"
							className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
						/>
					)}
				</button>

				<button
					type="button"
					onClick={() => setActiveTab("joined")}
					className={`flex-1 py-4 text-center text-sm font-medium relative whitespace-nowrap px-1 ${
						activeTab === "joined"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="relative flex items-center justify-center gap-1">
						<BuildingIcon size={16} />
						가입 센터
						{joinedCount > 0 && (
							<span className="absolute -top-2 -left-0 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
								{joinedCount}
							</span>
						)}
					</span>
					{activeTab === "joined" && (
						<motion.div
							layoutId="activeTab"
							className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
						/>
					)}
				</button>

				<button
					type="button"
					onClick={() => setActiveTab("pending")}
					className={`flex-1 py-4 text-center text-sm font-medium relative whitespace-nowrap px-1 ${
						activeTab === "pending"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="relative flex items-center justify-center gap-1">
						<Clock size={16} />
						신청중
						{pendingCount > 0 && (
							<span className="absolute -top-2 -left-0 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
								{pendingCount}
							</span>
						)}
					</span>
					{activeTab === "pending" && (
						<motion.div
							layoutId="activeTab"
							className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
						/>
					)}
				</button>
			</div>

			{/* Content area */}
			<div className="flex-1 p-4">
				<AnimatePresence mode="wait">
					{activeTab === "explore" && (
						<motion.div
							key="explore"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="space-y-4"
						>
							{selectedCity ? (
								<>
									{/* 선택된 지역 헤더와 뒤로가기 */}
									<div className="flex items-center mb-2">
										<button
											type="button"
											onClick={handleBackButton}
											className="mr-2 p-2 rounded-full hover:bg-gray-100"
										>
											<ChevronLeft
												size={20}
												className="text-gray-500"
											/>
										</button>
										<h2 className="text-lg font-bold flex items-center">
											{formatCityName(selectedCity)} 지역
											센터
										</h2>
									</div>

									{/* 지역별 센터 목록 */}
									{isCityResultsLoading ? (
										<div className="py-8">
											<div className="space-y-3">
												{[1, 2, 3].map((i) => (
													<motion.div
														key={i}
														initial={{
															opacity: 0,
															y: 10,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: i * 0.1,
														}}
														className="animate-pulse bg-white rounded-xl p-4 shadow-sm"
													>
														<div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
														<div className="h-4 bg-gray-100 rounded w-1/2" />
													</motion.div>
												))}
											</div>
										</div>
									) : cityResults?.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl shadow-sm">
											<div className="bg-gray-100 rounded-full p-4 mb-3">
												<BuildingIcon
													size={24}
													className="text-gray-400"
												/>
											</div>
											<p className="text-gray-500 text-center">
												이 지역에 등록된 센터가 없습니다
											</p>
											<button
												type="button"
												onClick={() =>
													setSelectedCity(null)
												}
												className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
											>
												다른 지역 보기
											</button>
										</div>
									) : (
										<div className="space-y-3">
											{cityResults?.map(
												(
													center: SearchCenterCityData,
													index: number,
												) => (
													<CenterDecisionListItem
														key={center.centerId}
														centerId={center.centerId.toString()}
														centerName={
															center.centerName
														}
														status={center.status}
														centerJoinRequestId={
															center.centerJoinRequestId ||
															undefined
														}
														index={index}
													/>
												),
											)}
										</div>
									)}
								</>
							) : activeGroup ? (
								<>
									{/* 선택된 지역 그룹 헤더와 뒤로가기 */}
									<div className="flex items-center mb-3">
										<button
											type="button"
											onClick={() => setActiveGroup(null)}
											className="mr-2 p-2 rounded-full hover:bg-gray-100"
										>
											<ChevronLeft
												size={20}
												className="text-gray-500"
											/>
										</button>
										<h2 className="text-lg font-bold flex items-center">
											{activeGroup} 센터
										</h2>
									</div>

									{/* 지역 그룹 내 지역 목록 */}
									<div className="grid grid-cols-2 gap-3">
										{cityGroups[
											activeGroup as keyof typeof cityGroups
										]?.map((cityCode) => {
											// existingCenterCities에서 해당 도시의 센터 개수 찾기
											const cityData =
												existingCenterCities?.find(
													(city: CenterCityData) =>
														city.centerCity ===
														cityCode,
												);
											const count = cityData
												? cityData.count
												: 0;

											// 센터 개수가 0개인 도시는 표시하지 않음
											if (count === 0) return null;

											return (
												<motion.button
													key={cityCode}
													type="button"
													whileTap={{ scale: 0.98 }}
													onClick={() =>
														selectCity(cityCode)
													}
													className="bg-male
														text-white rounded-xl p-4 pb-2 shadow-sm h-20 
														flex flex-col justify-between text-left"
												>
													<div className="flex items-center">
														{getCityIcon(cityCode)}
														<span className="font-bold">
															{formatCityName(
																cityCode,
															)}
														</span>
													</div>
													<div className="flex justify-end gap-4 items-center">
														<span className="text-xl font-bold">
															{count}
														</span>
														<span className="text-xs opacity-80">
															개 센터
														</span>
													</div>
												</motion.button>
											);
										})}
									</div>
								</>
							) : (
								<>
									{/* 지역 그룹 선택 화면 */}
									<div className="mb-3">
										<h2 className="text-lg font-bold mb-2">
											지역별 센터 찾기
										</h2>
										<p className="text-sm text-gray-500">
											지역을 선택하여 센터를 찾아보세요
										</p>
									</div>

									{/* 지역 그룹 그리드 */}
									<div className="grid grid-cols-2 gap-4">
										{Object.keys(cityGroups).map(
											(groupName) => {
												// 그룹 내 도시들의 센터 총 개수 계산
												const groupCities =
													cityGroups[
														groupName as keyof typeof cityGroups
													];
												let totalCount = 0;

												if (existingCenterCities) {
													for (const city of existingCenterCities) {
														if (
															groupCities.includes(
																city.centerCity,
															)
														) {
															totalCount +=
																city.count;
														}
													}
												}

												// 센터 개수가 0개인 그룹은 표시하지 않음
												if (totalCount === 0)
													return null;

												// 모든 카드는 bg-male 사용
												return (
													<motion.div
														key={groupName}
														whileHover={{
															scale: 1.02,
														}}
														whileTap={{
															scale: 0.98,
														}}
														onClick={() =>
															setActiveGroup(
																groupName,
															)
														}
														className="bg-male text-white 
															rounded-xl p-4 pb-2 shadow-md h-36 cursor-pointer
															flex flex-col justify-between"
													>
														<div>
															<h3 className="text-xl font-bold">
																{groupName}
															</h3>
															<p className="text-sm opacity-80 mt-1">
																{
																	groupCities.filter(
																		(
																			cityCode,
																		) => {
																			const cityData =
																				existingCenterCities?.find(
																					(
																						city: CenterCityData,
																					) =>
																						city.centerCity ===
																						cityCode,
																				);
																			return (
																				cityData &&
																				cityData.count >
																					0
																			);
																		},
																	).length
																}
																개 지역
															</p>
														</div>
														<div className="flex justify-end gap-4 items-center">
															<div className="text-xs opacity-80">
																등록된 센터
															</div>
															<div className="text-2xl font-bold">
																{totalCount}
															</div>
														</div>
													</motion.div>
												);
											},
										)}
									</div>

									{/* 전체 지역 통계 카드 */}
									{/* {!isCitiesLoading &&
										existingCenterCities && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.2 }}
												className="mt-6 bg-white rounded-xl p-4 shadow-sm"
											>
												<h3 className="text-base font-medium mb-3 text-gray-700">
													전체 센터 현황
												</h3>
												<div className="flex items-center justify-between">
													<div className="text-gray-500 text-sm">
														등록된 지역:{" "}
														<span className="font-semibold text-gray-800">
															{
																existingCenterCities.length
															}
															개 지역
														</span>
													</div>
													<div className="text-gray-500 text-sm">
														전체 센터:{" "}
														<span className="font-semibold text-gray-800">
															{existingCenterCities.reduce(
																(
																	sum: number,
																	city: CenterCityData,
																) =>
																	sum +
																	city.count,
																0,
															)}
															개 센터
														</span>
													</div>
												</div>
											</motion.div>
										)} */}
								</>
							)}

							{/* 데이터 없을 때 표시 (지역 그룹 화면이 아닐 때만) */}
							{!activeGroup &&
								!selectedCity &&
								existingCenterCities?.length === 0 &&
								!isCitiesLoading && (
									<div className="flex flex-col items-center justify-center py-6 mt-4 bg-white rounded-xl shadow-sm">
										<div className="bg-blue-100 rounded-full p-4 mb-3">
											<MapPinIcon
												size={24}
												className="text-blue-500"
											/>
										</div>
										<p className="text-gray-700 text-center font-medium">
											등록된 센터가 없습니다
										</p>
										<p className="text-gray-500 text-center text-sm mt-1">
											새로운 센터를 만들어보세요
										</p>
										{/* <button
											type="button"
											onClick={handleDummyCenterCreate}
											className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
										>
											테스트 센터 생성하기
										</button> */}
									</div>
								)}
						</motion.div>
					)}

					{activeTab === "search" && (
						<motion.div
							key="search"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="space-y-4"
						>
							{/* Search box */}
							<div className="relative">
								<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
									<SearchIcon
										size={16}
										className="text-gray-400"
									/>
								</div>
								<input
									type="text"
									placeholder="센터 이름으로 검색"
									onChange={handleInput}
									value={inputValue}
									className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Search results */}
							<div className="space-y-3">
								{isLoading ? (
									<div className="py-8">
										<div className="animate-pulse flex flex-col items-center">
											<div className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
											<div className="h-4 w-28 bg-gray-200 rounded" />
										</div>
									</div>
								) : searchResults?.length === 0 &&
									query.length > 0 ? (
									<div className="flex flex-col items-center justify-center py-8">
										<div className="bg-gray-100 rounded-full p-4 mb-3">
											<SearchIcon
												size={24}
												className="text-gray-400"
											/>
										</div>
										<p className="text-gray-500 text-center">
											검색 결과가 없습니다
										</p>
										<p className="text-gray-400 text-xs text-center mt-1">
											다른 검색어를 입력해 보세요
										</p>
									</div>
								) : query.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-8 px-4">
										<div className="bg-blue-50 rounded-full p-4 mb-3">
											<BuildingIcon
												size={24}
												className="text-blue-500"
											/>
										</div>
										<p className="text-gray-500 text-center">
											센터 이름을 검색해보세요
										</p>
										<p className="text-gray-400 text-xs text-center mt-1">
											센터에 가입하면 더 많은 기능을
											이용할 수 있습니다
										</p>
									</div>
								) : (
									searchResults?.map(
										(
											center: CenterResponseData,
											index: number,
										) => (
											<CenterDecisionListItem
												key={center.centerId}
												centerJoinRequestId={
													center.centerJoinRequestId
												}
												centerId={center.centerId}
												centerName={center.centerName}
												status={center.status}
												index={index}
												query={query}
											/>
										),
									)
								)}
							</div>
						</motion.div>
					)}

					{activeTab === "joined" && (
						<motion.div
							key="joined"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="space-y-3"
						>
							{isMycentersLoading ? (
								<div className="py-8">
									<div className="animate-pulse flex flex-col items-center">
										<div className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
										<div className="h-4 w-28 bg-gray-200 rounded" />
									</div>
								</div>
							) : myCenters?.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-xl shadow-sm">
									<div className="bg-gray-100 rounded-full p-4 mb-3">
										<BuildingIcon
											size={24}
											className="text-gray-400"
										/>
									</div>
									<p className="text-gray-500 text-center">
										가입한 센터가 없습니다
									</p>
									<p className="text-gray-400 text-xs text-center mt-1 mb-4">
										센터에 가입하고 다양한 기능을
										활용해보세요
									</p>
									<button
										type="button"
										onClick={() => setActiveTab("explore")}
										className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-600 transition-colors"
									>
										센터 둘러보기
									</button>
								</div>
							) : (
								myCenters?.map(
									(
										center: MyCenterResponseData,
										index: number,
									) => (
										<CenterDecisionListItem
											key={`my-center-${center.centerId}-${index}`}
											centerId={center.centerId}
											centerName={center.centerName}
											status={center.centerGrade}
											index={index}
										/>
									),
								)
							)}
						</motion.div>
					)}

					{activeTab === "pending" && (
						<motion.div
							key="pending"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="space-y-3"
						>
							{isPendingLoading ? (
								<div className="py-8">
									<div className="animate-pulse flex flex-col items-center">
										<div className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
										<div className="h-4 w-28 bg-gray-200 rounded" />
									</div>
								</div>
							) : myJoinRequestCenters?.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-xl shadow-sm">
									<div className="bg-gray-100 rounded-full p-4 mb-3">
										<Clock
											size={24}
											className="text-gray-400"
										/>
									</div>
									<p className="text-gray-500 text-center">
										가입 신청중인 센터가 없습니다
									</p>
									<p className="text-gray-400 text-xs text-center mt-1 mb-4">
										센터를 검색하고 가입 신청을 해보세요
									</p>
									<button
										type="button"
										onClick={() => setActiveTab("explore")}
										className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-600 transition-colors"
									>
										센터 둘러보기
									</button>
								</div>
							) : (
								myJoinRequestCenters?.map(
									(
										center: MyJoinRequestCenterResponseData,
										index: number,
									) => (
										<CenterDecisionListItem
											key={`my-join-request-center-${center.centerId}-${index}`}
											centerJoinRequestId={
												center.centerJoinRequestId
											}
											centerId={center.centerId}
											centerName={center.centerName}
											status="APPLIED"
											index={index}
											query={query}
										/>
									),
								)
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Test center button */}
				{/* {activeTab === "search" && query.length === 0 ? (
					<motion.button
						onClick={handleDummyCenterCreate}
						disabled={isCreating}
						className="mt-8 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 rounded-xl p-4 w-full shadow-sm hover:bg-gray-50 transition-colors"
						whileTap={{ scale: 0.98 }}
						type="button"
					>
						<Plus size={16} />
						<span>테스트 센터 생성하기</span>
						{isCreating && (
							<span className="ml-2 inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
						)}
					</motion.button>
				) : null} */}
			</div>
		</div>
	);
}

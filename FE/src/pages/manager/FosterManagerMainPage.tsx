import { useState } from "react";
import { Search, PawPrint } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";
import { fetchFosterApplicationsAPI, fetchFosteredDogsAPI } from "@/api/foster";
import FosteredListItem from "@/components/foster/FosteredListItem";
import FosterApplicationListItem from "@/components/foster/FosterApplicationListItem";

export default function FosterManagerMainPage() {
	const [tab, setTab] = useState<"pending" | "fostered">("pending");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const { selectedCenter } = useCenterStore();

	// 임시보호 신청 수 조회
	const {
		data: fosterApplicationsData,
		isLoading: isLoadingFosterApplications,
	} = useQuery({
		queryKey: ["fosterApplications", selectedCenter?.centerId],
		queryFn: () =>
			fetchFosterApplicationsAPI(Number(selectedCenter?.centerId)),
		enabled: !!selectedCenter?.centerId,
		refetchOnMount: true,
		staleTime: 0,
	});

	// 임시보호 중인 강아지 수 조회
	const { data: fosteredDogsData, isLoading: isLoadingFosteredDogs } =
		useQuery({
			queryKey: ["fosteredDogs", selectedCenter?.centerId],
			queryFn: () =>
				fetchFosteredDogsAPI(Number(selectedCenter?.centerId)),
			enabled: !!selectedCenter?.centerId,
			refetchOnMount: true,
			staleTime: 0,
		});

	// count 속성에 안전하게 접근
	const fosterApplicationsCount = fosterApplicationsData?.length || 0;
	const fosteredDogsCount = fosteredDogsData?.length || 0;

	// 검색어로 필터링된 데이터
	const filteredFosterApplications = fosterApplicationsData?.filter(
		(application) =>
			application.dogName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()),
	);

	const filteredFosteredDogs = fosteredDogsData?.filter((dog) =>
		dog.dogName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleTabChange = (newTab: "pending" | "fostered") => {
		setTab(newTab);
		setSearchQuery(""); // 탭 변경 시 검색어 초기화
	};

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

			<div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
				{/* 탭 */}
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<div className="flex border-b">
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "pending"
									? "text-orange-600 border-b-2 border-orange-600"
									: "text-gray-500"
							}`}
							onClick={() => handleTabChange("pending")}
						>
							대기 중
							{!isLoadingFosterApplications && (
								<span className="absolute top-2 ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-600 rounded-full">
									{fosterApplicationsCount}
								</span>
							)}
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "fostered"
									? "text-orange-600 border-b-2 border-orange-600"
									: "text-gray-500"
							}`}
							onClick={() => handleTabChange("fostered")}
						>
							임시보호 중
							{!isLoadingFosteredDogs && (
								<span className="absolute top-2 ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-600 rounded-full">
									{fosteredDogsCount}
								</span>
							)}
						</button>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="relative">
					<input
						type="text"
						className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
						placeholder="강아지 이름으로 검색"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				</div>

				{/* 임시보호 신청 목록 */}
				<div>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						{tab === "pending"
							? "임시보호 신청 목록"
							: "임시보호 중인 목록"}
					</h2>

					{/* 대기 중 탭 */}
					{tab === "pending" && (
						<div className="space-y-3">
							{filteredFosterApplications?.map((application) => (
								<FosterApplicationListItem
									key={application.dogId}
									data={application}
								/>
							))}
							{filteredFosterApplications?.length === 0 && (
								<p className="text-center text-gray-500 py-4">
									{searchQuery
										? "검색 결과가 없습니다"
										: "임시보호 신청이 없습니다"}
								</p>
							)}
						</div>
					)}

					{/* 임시보호 중 탭 */}
					{tab === "fostered" && (
						<div className="space-y-3">
							{filteredFosteredDogs?.map((data) => (
								<FosteredListItem
									key={data.dogId}
									data={data}
								/>
							))}
							{filteredFosteredDogs?.length === 0 && (
								<p className="text-center text-gray-500 py-4">
									{searchQuery
										? "검색 결과가 없습니다"
										: "임시보호 중인 강아지가 없습니다"}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

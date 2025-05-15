import { useState, useEffect } from "react";
import { Home, Search } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import AdoptedDogsGrid from "@/components/adoption/AdoptedDogsGrid";
import AdoptionApplicationsList from "@/components/adoption/AdoptionApplicationsList";
import { fetchAppliesCountOfDogs, fetchAdoptedDogCount } from "@/api/adoption";
import { useQuery } from "@tanstack/react-query";

interface CountResponse {
	count: number;
}

export default function AdoptionManagerMainPage() {
	const [tab, setTab] = useState<"pending" | "adopted">("pending");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const { selectedCenter } = useCenterStore();

	// 입양 신청 수 조회
	const { data: appliesCountData, isLoading: isLoadingAppliesCount } =
		useQuery<CountResponse>({
			queryKey: ["appliesCount", selectedCenter?.centerId],
			queryFn: () =>
				fetchAppliesCountOfDogs(Number(selectedCenter?.centerId)),
			enabled: !!selectedCenter?.centerId,
		});

	// 입양된 강아지 수 조회
	const { data: adoptedCountData, isLoading: isLoadingAdoptedCount } =
		useQuery<CountResponse>({
			queryKey: ["adoptedCount", selectedCenter?.centerId],
			queryFn: () =>
				fetchAdoptedDogCount(Number(selectedCenter?.centerId)),
			enabled: !!selectedCenter?.centerId,
		});

	// count 속성에 안전하게 접근
	const appliesCount = appliesCountData?.count || 0;
	const adoptedCount = adoptedCountData?.count || 0;

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
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "pending"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("pending")}
						>
							대기 중
							{!isLoadingAppliesCount && (
								<span className="absolute top-2 ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-male rounded-full">
									{appliesCount}
								</span>
							)}
						</button>
						<button
							type="button"
							className={`flex-1 py-3 font-medium text-center relative ${
								tab === "adopted"
									? "text-blue-600 border-b-2 border-blue-600"
									: "text-gray-500"
							}`}
							onClick={() => setTab("adopted")}
						>
							입양 중
							{!isLoadingAdoptedCount && (
								<span className="absolute top-2 ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-male rounded-full">
									{adoptedCount}
								</span>
							)}
						</button>
					</div>
				</div>

				{/* 검색 필드 */}
				<div className="relative">
					<input
						type="text"
						className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
						placeholder="강아지 이름으로 검색"
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
					{tab === "pending" && (
						<AdoptionApplicationsList searchQuery={searchQuery} />
					)}

					{/* 입양 중 탭 */}
					{tab === "adopted" && (
						<AdoptedDogsGrid searchQuery={searchQuery} />
					)}
				</div>
			</div>
		</div>
	);
}

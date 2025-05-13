import CenterDecisionListItem from "@/components/common/CenterDecisionListItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import {
	fetchCenters,
	fetchMyCenters,
	fetchMyJoinRequestCenters,
	createCenter,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { locations } from "@/types/center";
import {
	BuildingIcon,
	Search as SearchIcon,
	Clock,
	Check,
	Plus,
	ChevronRight,
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

// Debounce search function
const debouncedSearch = debounce((val: string, setter: (s: string) => void) => {
	setter(val);
}, 300);

export default function CenterDecisionPage() {
	const [query, setQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"search" | "joined" | "pending">(
		"search",
	);
	const { selectedCenter, clearSelectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const { data: searchResults, isLoading } = useQuery({
		queryKey: ["centerSearch", query],
		queryFn: () => fetchCenters(query),
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

	const { mutate: createCenterMutate, isPending: isCreating } = useMutation({
		mutationKey: ["createCenter"],
		mutationFn: createCenter,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["myCenters"] });
			toast.success("테스트 센터가 생성되었습니다");
		},
		onError: (error) => {
			toast.error("센터 생성에 실패했습니다");
		},
	});

	const handleDummyCenterCreate = () => {
		createCenterMutate({
			name: "신청 확인용",
			sponsorAmount: 25000,
			centerCity: locations.SEOUL,
		});
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(e.target.value, setQuery);
	};

	useEffect(() => {
		clearSelectedCenter();
	}, [clearSelectedCenter]);

	// Count badge numbers
	const joinedCount = myCenters?.length || 0;
	const pendingCount = myJoinRequestCenters?.length || 0;

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			{/* Header with welcome message */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 shadow-md">
				<h1 className="text-2xl font-bold mb-2">반가워요!</h1>
				<p className="text-blue-100 text-sm">
					센터를 선택하고 더 많은 기능을 이용해보세요
				</p>
			</div>

			{/* Tab navigation */}
			<div className="flex bg-white shadow-sm sticky top-0 z-10">
				<button
					type="button"
					onClick={() => setActiveTab("search")}
					className={`flex-1 py-4 text-center text-sm font-medium relative ${
						activeTab === "search"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span>센터 찾기</span>
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
					className={`flex-1 py-4 text-center text-sm font-medium relative ${
						activeTab === "joined"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="relative">
						가입한 센터
						{joinedCount > 0 && (
							<span className="absolute -top-2 -right-6 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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
					className={`flex-1 py-4 text-center text-sm font-medium relative ${
						activeTab === "pending"
							? "text-blue-600"
							: "text-gray-500"
					}`}
				>
					<span className="relative">
						신청중
						{pendingCount > 0 && (
							<span className="absolute -top-2 -right-6 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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
										onClick={() => setActiveTab("search")}
										className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-600 transition-colors"
									>
										센터 찾기
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
										onClick={() => setActiveTab("search")}
										className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-600 transition-colors"
									>
										센터 찾기
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
				{activeTab === "search" && query.length === 0 && (
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
				)}
			</div>
		</div>
	);
}

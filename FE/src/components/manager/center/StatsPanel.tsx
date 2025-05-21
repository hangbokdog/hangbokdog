import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	PointElement,
	LineElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
	MdOutlinePets,
	MdVolunteerActivism,
	MdFavorite,
	MdTrendingUp,
	MdShowChart,
	MdPeople,
	MdPersonAdd,
	MdWorkspaces,
	MdAnalytics,
	MdSupervisorAccount,
	MdPerson,
} from "react-icons/md";
import useCenterStore from "@/lib/store/centerStore";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCenterStatisticsAPI, fetchCenterStatsAPI } from "@/api/center";
import type {
	CenterStatisticsResponse,
	CenterStatsResponse,
} from "@/types/center";
import { BuildingIcon } from "lucide-react";

// Chart.js 컴포넌트 등록
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
);

// 통계 카드 타입 정의
interface StatCardProps {
	title: string;
	value: number | string;
	subValue?: string;
	trend?: "up" | "down" | "neutral";
	trendValue?: string;
	icon: ReactNode;
	color: string;
}

export default function StatsPanel() {
	const { selectedCenter } = useCenterStore();
	const [isLoaded, setIsLoaded] = useState(false);
	const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<"center" | "members">("center");
	const months = [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월",
	];
	const currentMonth = new Date().getMonth(); // 0-11, 0은 1월

	const { data } = useQuery<CenterStatsResponse>({
		queryKey: ["statsData", selectedCenter?.centerId],
		queryFn: () => fetchCenterStatsAPI(selectedCenter?.centerId || ""),
		enabled: !!selectedCenter?.centerId,
	});

	const { data: centerStatistics } = useQuery<CenterStatisticsResponse>({
		queryKey: ["centerStatistics", selectedCenter?.centerId],
		queryFn: () => fetchCenterStatisticsAPI(selectedCenter?.centerId || ""),
		enabled: !!selectedCenter?.centerId,
	});

	// 월간 후원 현황을 위한 더미 데이터
	const monthlyDonationsDummy = [
		125000, 140000, 130000, 185000, 210000, 175000, 145000, 160000, 190000,
		205000, 175000, 210000,
	];
	const monthlySponsorsDummy = [8, 10, 9, 12, 15, 13, 10, 11, 14, 16, 13, 15];

	// 회원 통계를 위한 더미 데이터
	const membersDummy = {
		total: 325,
		lastMonth: 298,
		active: 210,
		lastMonthActive: 185,
		new: 27,
		lastMonthNew: 22,
		volunteers: 115,
		lastMonthVolunteers: 105,
	};

	const monthlyNewMembersDummy = [
		15, 18, 12, 25, 19, 22, 17, 20, 23, 28, 22, 27,
	];
	const monthlyActiveUsersDummy = [
		80, 95, 90, 105, 115, 125, 110, 115, 125, 135, 130, 145,
	];

	// 컴포넌트 마운트 시 로딩 애니메이션 추가
	useEffect(() => {
		const timer = setTimeout(() => setIsLoaded(true), 300);
		return () => clearTimeout(timer);
	}, []);

	// 선택된 월의 데이터 가져오기
	const getSelectedMonthData = () => {
		if (selectedMonth === null) return null;
		return {
			donationAmount: monthlyDonationsDummy[selectedMonth],
			sponsorCount: monthlySponsorsDummy[selectedMonth],
			month: months[selectedMonth],
		};
	};

	const selectedMonthData = getSelectedMonthData();

	// 개 상태 차트 데이터
	const dogStatusData = {
		labels: ["보호 중", "임시보호 중", "입양 완료"],
		datasets: [
			{
				data: [
					data?.protectedDog || 0,
					data?.fosterCount || 0,
					data?.adoptionCount || 0,
				],
				backgroundColor: ["#4dabf7", "#51cf66", "#ff637e"],
				borderColor: ["#ffffff", "#ffffff", "#ffffff"],
				borderWidth: 2,
				borderRadius: 5,
				hoverOffset: 10,
			},
		],
	};

	// 월간 후원 차트 데이터 (더미 데이터 사용)
	const monthlyDonationData = {
		labels: months,
		datasets: [
			{
				label: "후원금",
				data: monthlyDonationsDummy,
				borderColor: "#4dabf7",
				backgroundColor: "rgba(77, 171, 247, 0.1)",
				borderWidth: 2,
				fill: true,
				tension: 0.4,
				pointBackgroundColor: "#fff",
				pointBorderColor: "#4dabf7",
				pointBorderWidth: 2,
				pointRadius: 4,
				pointHitRadius: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "#4dabf7",
				pointHoverBorderColor: "#fff",
				pointHoverBorderWidth: 2,
			},
		],
	};

	// 회원 유형 차트 데이터는 더 이상 필요하지 않음 (실제 데이터 사용)

	// 실제 데이터로 대체되었으므로 차트 관련 더미 데이터 및 옵션 제거

	// 통계 카드 컴포넌트
	const StatCard = ({
		title,
		value,
		subValue,
		trend,
		trendValue,
		icon,
		color,
	}: StatCardProps) => (
		<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
			<div
				className={`absolute right-0 top-0 w-24 h-24 opacity-5 rounded-bl-full ${color.replace("bg-", "bg-")}`}
			/>
			<div className="flex items-start justify-between mb-2">
				<div className={`p-2 rounded-lg ${color}`}>{icon}</div>
				{trend && trendValue && (
					<div
						className={cn(
							"text-xs font-medium flex items-center px-2 py-1 rounded-full",
							trend === "up"
								? "bg-green-50 text-green-600"
								: trend === "down"
									? "bg-red-50 text-red-600"
									: "bg-gray-50 text-gray-600",
						)}
					>
						{trend === "up" ? (
							<MdTrendingUp className="mr-1" />
						) : trend === "down" ? (
							<MdTrendingUp className="mr-1 rotate-180" />
						) : (
							<MdShowChart className="mr-1" />
						)}
						{trendValue}
					</div>
				)}
			</div>
			<p className="text-gray-500 text-xs mb-1">{title}</p>
			<div className="flex flex-col">
				<p className="text-xl font-bold">{value}</p>
				{subValue && (
					<p className="text-xs text-gray-500">{subValue}</p>
				)}
			</div>
		</div>
	);

	// 추세 계산 함수
	const calculateTrend = (
		current: number,
		previous: number,
	): "up" | "down" | "neutral" => {
		if (current > previous) return "up";
		if (current < previous) return "down";
		return "neutral";
	};

	// 추세 텍스트 계산 함수
	const calculateTrendText = (current: number, previous: number): string => {
		const difference = current - previous;
		if (difference > 0) return `+${difference}`;
		if (difference < 0) return `${difference}`;
		return "유지";
	};

	// 탭 변경 핸들러
	const handleTabChange = (tab: "center" | "members") => {
		setActiveTab(tab);
	};

	return (
		<div
			className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
		>
			<div className="mb-5">
				<h2 className="text-lg font-bold text-gray-800 mb-2">
					{selectedCenter?.centerName || "센터"} 통계
				</h2>

				{/* 탭 내비게이션 */}
				<div className="flex border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
					<button
						type="button"
						onClick={() => handleTabChange("center")}
						className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center transition-colors ${
							activeTab === "center"
								? "bg-blue-50 text-blue-600"
								: "bg-white text-gray-600 hover:bg-gray-50"
						}`}
					>
						<BuildingIcon className="mr-2" size={18} />
						센터 현황
					</button>
					<button
						type="button"
						onClick={() => handleTabChange("members")}
						className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center transition-colors ${
							activeTab === "members"
								? "bg-blue-50 text-blue-600"
								: "bg-white text-gray-600 hover:bg-gray-50"
						}`}
					>
						<MdPeople className="mr-2" size={18} />
						회원 현황
					</button>
				</div>
			</div>

			{/* 센터 현황 탭 */}
			{activeTab === "center" && (
				<>
					{/* 통계 카드 그리드 */}
					<div className="grid grid-cols-2 gap-3 mb-5">
						<StatCard
							title="전체 아이들"
							value={data?.totalDogCount || 0}
							trend={calculateTrend(
								data?.totalDogCount || 0,
								data?.lastMonthDogCount || 0,
							)}
							trendValue={calculateTrendText(
								data?.totalDogCount || 0,
								data?.lastMonthDogCount || 0,
							)}
							icon={
								<MdOutlinePets className="size-5 text-blue-600" />
							}
							color="bg-blue-50"
						/>
						<StatCard
							title="임시보호 중"
							value={data?.fosterCount || 0}
							trend={calculateTrend(
								data?.fosterCount || 0,
								data?.lastMonthFosterCount || 0,
							)}
							trendValue={calculateTrendText(
								data?.fosterCount || 0,
								data?.lastMonthFosterCount || 0,
							)}
							icon={
								<MdVolunteerActivism className="size-5 text-green-600" />
							}
							color="bg-green-50"
						/>
						<StatCard
							title="입양 완료"
							value={data?.adoptionCount || 0}
							trend="neutral"
							trendValue="유지"
							icon={
								<MdFavorite className="size-5 text-rose-600" />
							}
							color="bg-rose-50"
						/>
						<StatCard
							title="이번 달 봉사횟수"
							value={data?.monthlyVolunteerParticipantCount || 0}
							trend="neutral"
							trendValue="유지"
							icon={
								<MdWorkspaces className="size-5 text-teal-600" />
							}
							color="bg-teal-50"
						/>
					</div>

					{/* 차트 섹션 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
						<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
							<MdOutlinePets
								className="mr-1 text-blue-500"
								size={18}
							/>
							아이들 현황
						</h3>
						<div
							className="w-full flex justify-center"
							style={{ height: "180px" }}
						>
							<Doughnut
								data={dogStatusData}
								options={{
									maintainAspectRatio: false,
									cutout: "65%",
									plugins: {
										legend: {
											position: "bottom",
											labels: {
												boxWidth: 12,
												padding: 15,
											},
										},
									},
								}}
							/>
						</div>
					</div>

					{/* 센터 요약 정보 카드 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
						<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
							<MdAnalytics
								className="mr-1 text-pink-500"
								size={18}
							/>
							센터 요약 정보
						</h3>

						{/* 센터 정보 요약 */}
						<div className="bg-blue-50 rounded-lg p-4">
							<div className="flex flex-col space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										전체 아이들
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{data?.totalDogCount || 0}마리
									</span>
								</div>
								<div className="w-full h-px bg-blue-200" />

								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										보호 중
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{data?.protectedDog || 0}마리
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										임시보호 중
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{data?.fosterCount || 0}마리
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										입양 완료
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{data?.adoptionCount || 0}마리
									</span>
								</div>
								{/* <div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										치료 중
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{data?.hospitalCount || 0}마리
									</span>
								</div> */}
							</div>
						</div>

						{/* 센터 정보 안내 메시지 */}
						{/* <div className="mt-4 bg-gray-50 rounded-lg p-3">
							<h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
								<MdShowChart className="mr-1" /> 센터 관리 팁
							</h4>
							<p className="text-xs text-gray-600">
								센터 관리 페이지에서 더 자세한 센터 정보를
								확인하고 관리할 수 있습니다.
							</p>
						</div> */}
					</div>
				</>
			)}

			{/* 회원 현황 탭 */}
			{activeTab === "members" && (
				<>
					{/* 회원 통계 카드 그리드 */}
					<div className="grid grid-cols-2 gap-3 mb-5">
						<StatCard
							title="전체 회원"
							value={centerStatistics?.totalMemberCount || 0}
							// 이전 달 데이터가 없어 추세 표시 불가
							icon={<MdPeople className="size-5 text-blue-600" />}
							color="bg-blue-50"
						/>
						<StatCard
							title="매니저"
							value={centerStatistics?.managerMemberCount || 0}
							// 이전 달 데이터가 없어 추세 표시 불가
							icon={
								<MdSupervisorAccount className="size-5 text-orange-600" />
							}
							color="bg-orange-50"
						/>
						<StatCard
							title="일반 회원"
							value={centerStatistics?.normalMemberCount || 0}
							// 이전 달 데이터가 없어 추세 표시 불가
							icon={
								<MdPerson className="size-5 text-green-600" />
							}
							color="bg-green-50"
						/>
						<StatCard
							title="신규 가입자"
							value={centerStatistics?.newMemberCount || 0}
							subValue="이번 달"
							// 이전 달 데이터가 없어 추세 표시 불가
							icon={
								<MdPersonAdd className="size-5 text-pink-600" />
							}
							color="bg-pink-50"
						/>
						{/* 봉사 참여자 데이터가 0이므로 활용해야 할 경우 아래 주석을 해제
						<StatCard
							title="봉사 참여자"
							value={centerStatistics?.volunteerParticipantCount || 0}
							// 이전 달 데이터가 없어 추세 표시 불가
							icon={
								<MdVolunteerActivism className="size-5 text-green-600" />
							}
							color="bg-green-50"
						/>
						*/}
					</div>

					{/* 회원 유형 분포 차트 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
						<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
							<MdPeople
								className="mr-1 text-blue-500"
								size={18}
							/>
							회원 유형 분포
						</h3>
						<div
							className="w-full flex justify-center"
							style={{ height: "180px" }}
						>
							<Doughnut
								data={{
									labels: ["일반 회원", "매니저"],
									datasets: [
										{
											data: [
												centerStatistics?.normalMemberCount ||
													0,
												centerStatistics?.managerMemberCount ||
													0,
											],
											backgroundColor: [
												"#4dabf7",
												"#fd7e14",
											],
											borderColor: ["#ffffff", "#ffffff"],
											borderWidth: 2,
											borderRadius: 5,
											hoverOffset: 10,
										},
									],
								}}
								options={{
									maintainAspectRatio: false,
									cutout: "65%",
									plugins: {
										legend: {
											position: "bottom",
											labels: {
												boxWidth: 12,
												padding: 15,
												font: {
													size: 11,
												},
											},
										},
									},
								}}
							/>
						</div>
					</div>

					{/* 회원 요약 정보 카드 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
						<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
							<MdAnalytics
								className="mr-1 text-pink-500"
								size={18}
							/>
							회원 요약 정보
						</h3>

						{/* 회원 정보 요약 */}
						<div className="bg-blue-50 rounded-lg p-4">
							<div className="flex flex-col space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										전체 회원
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{centerStatistics?.totalMemberCount ||
											0}
										명
									</span>
								</div>
								<div className="w-full h-px bg-blue-200" />

								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										매니저
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{centerStatistics?.managerMemberCount ||
											0}
										명
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										일반 회원
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{centerStatistics?.normalMemberCount ||
											0}
										명
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										신규 회원 (이번 달)
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{centerStatistics?.newMemberCount || 0}
										명
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-sm text-blue-700 font-medium">
										봉사 참여자
									</span>
									<span className="text-sm text-blue-900 font-bold">
										{centerStatistics?.volunteerParticipantCount ||
											0}
										명
									</span>
								</div>
							</div>
						</div>

						{/* 회원 정보 안내 메시지 */}
						<div className="mt-4 bg-gray-50 rounded-lg p-3">
							<h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
								<MdShowChart className="mr-1" /> 회원 관리 팁
							</h4>
							<p className="text-xs text-gray-600">
								회원 관리 탭에서 더 자세한 회원 정보를 확인하고
								관리할 수 있습니다.
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

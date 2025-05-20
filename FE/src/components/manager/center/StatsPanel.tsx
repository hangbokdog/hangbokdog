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
import { Doughnut, Line } from "react-chartjs-2";
import {
	MdOutlinePets,
	MdVolunteerActivism,
	MdFavorite,
	MdTrendingUp,
	MdShowChart,
	MdPeople,
	MdPersonAdd,
	MdWorkspaces,
	MdCardMembership,
	MdAnalytics,
} from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import useCenterStore from "@/lib/store/centerStore";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCenterStatsAPI } from "@/api/center";
import type { CenterStatsResponse } from "@/types/center";

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
		labels: ["보호 중", "입양 완료", "치료 중"],
		datasets: [
			{
				data: [
					data?.protectedDog || 0,
					data?.adoptionCount || 0,
					data?.hospitalCount || 0,
				],
				backgroundColor: ["#4dabf7", "#51cf66", "#ff8787"],
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

	// 회원 유형 차트 데이터
	const memberTypesData = {
		labels: ["일반 회원", "봉사자", "후원자", "임시 보호자"],
		datasets: [
			{
				data: [180, 115, 42, 30], // 더미 데이터
				backgroundColor: ["#4dabf7", "#51cf66", "#fcc419", "#8c7ae6"],
				borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
				borderWidth: 2,
				borderRadius: 5,
				hoverOffset: 10,
			},
		],
	};

	// 회원 활동 추이 차트 데이터
	const memberActivityData = {
		labels: months,
		datasets: [
			{
				label: "신규 회원",
				data: monthlyNewMembersDummy,
				borderColor: "#f06595",
				backgroundColor: "rgba(240, 101, 149, 0.1)",
				borderWidth: 2,
				fill: true,
				tension: 0.4,
				pointBackgroundColor: "#fff",
				pointBorderColor: "#f06595",
				pointBorderWidth: 2,
				pointRadius: 3,
			},
			{
				label: "활성 회원",
				data: monthlyActiveUsersDummy,
				borderColor: "#4dabf7",
				backgroundColor: "rgba(77, 171, 247, 0.1)",
				borderWidth: 2,
				fill: true,
				tension: 0.4,
				pointBackgroundColor: "#fff",
				pointBorderColor: "#4dabf7",
				pointBorderWidth: 2,
				pointRadius: 3,
			},
		],
	};

	// 월간 후원 차트 옵션
	const monthlyDonationOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: "index" as const,
			intersect: false,
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (context: { raw: number }) => {
						return `${context.raw.toLocaleString()}원`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: (value: number) => {
						if (value >= 1000) {
							return `${value / 10000}만원`;
						}
						return `${value.toLocaleString()}원`;
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
		onClick: (_: unknown, elements: { index: number }[]) => {
			if (elements.length > 0) {
				const index = elements[0].index;
				setSelectedMonth(index);
			}
		},
	};

	// 회원 활동 추이 차트 옵션
	const memberActivityOptions = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: "index" as const,
			intersect: false,
		},
		plugins: {
			legend: {
				position: "top" as const,
				labels: {
					boxWidth: 12,
					usePointStyle: true,
					padding: 15,
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: (value: number) => {
						return `${value}명`;
					},
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
	};

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
		if (previous === 0) return "N/A";
		const percent = Math.round(((current - previous) / previous) * 100);
		if (percent > 0) return `+${percent}%`;
		if (percent < 0) return `${percent}%`;
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
						<MdOutlinePets className="mr-2" size={18} />
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
								<MdFavorite className="size-5 text-amber-600" />
							}
							color="bg-amber-50"
						/>
						<StatCard
							title="이번 달 봉사횟수"
							value="24회"
							trend="up"
							trendValue="+12%" // 더미 데이터
							icon={
								<MdWorkspaces className="size-5 text-teal-600" />
							}
							color="bg-teal-50"
						/>
					</div>

					{/* 차트 섹션 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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
				</>
			)}

			{/* 회원 현황 탭 */}
			{activeTab === "members" && (
				<>
					{/* 회원 통계 카드 그리드 */}
					<div className="grid grid-cols-2 gap-3 mb-5">
						<StatCard
							title="전체 회원"
							value={membersDummy.total}
							trend={calculateTrend(
								membersDummy.total,
								membersDummy.lastMonth,
							)}
							trendValue={calculateTrendText(
								membersDummy.total,
								membersDummy.lastMonth,
							)}
							icon={<MdPeople className="size-5 text-blue-600" />}
							color="bg-blue-50"
						/>
						<StatCard
							title="활성 회원"
							value={membersDummy.active}
							trend={calculateTrend(
								membersDummy.active,
								membersDummy.lastMonthActive,
							)}
							trendValue={calculateTrendText(
								membersDummy.active,
								membersDummy.lastMonthActive,
							)}
							icon={
								<MdCardMembership className="size-5 text-violet-600" />
							}
							color="bg-violet-50"
						/>
						<StatCard
							title="신규 가입자"
							value={membersDummy.new}
							subValue="이번 달"
							trend={calculateTrend(
								membersDummy.new,
								membersDummy.lastMonthNew,
							)}
							trendValue={calculateTrendText(
								membersDummy.new,
								membersDummy.lastMonthNew,
							)}
							icon={
								<MdPersonAdd className="size-5 text-pink-600" />
							}
							color="bg-pink-50"
						/>
						<StatCard
							title="봉사 참여자"
							value={membersDummy.volunteers}
							trend={calculateTrend(
								membersDummy.volunteers,
								membersDummy.lastMonthVolunteers,
							)}
							trendValue={calculateTrendText(
								membersDummy.volunteers,
								membersDummy.lastMonthVolunteers,
							)}
							icon={
								<MdVolunteerActivism className="size-5 text-green-600" />
							}
							color="bg-green-50"
						/>
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
								data={memberTypesData}
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

					{/* 회원 활동 추이 차트 */}
					<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
						<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
							<MdAnalytics
								className="mr-1 text-pink-500"
								size={18}
							/>
							회원 활동 추이
						</h3>
						<div
							className="touch-pan-x"
							style={{ height: "220px" }}
						>
							<Line
								data={memberActivityData}
								options={memberActivityOptions as any}
							/>
						</div>

						{/* 월별 필터 버튼 */}
						<div className="mt-5 mb-2">
							<p className="text-xs text-gray-500 mb-2">
								월별 필터
							</p>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full"
								>
									최근 3개월
								</button>
								<button
									type="button"
									className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-3 py-1.5 rounded-full"
								>
									최근 6개월
								</button>
								<button
									type="button"
									className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-3 py-1.5 rounded-full"
								>
									최근 1년
								</button>
								<button
									type="button"
									className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-3 py-1.5 rounded-full"
								>
									전체 기간
								</button>
							</div>
						</div>

						{/* 회원 인사이트 카드 */}
						<div className="mt-4 bg-blue-50 rounded-lg p-3">
							<h4 className="font-medium text-sm text-blue-700 mb-2 flex items-center">
								<MdShowChart className="mr-1" /> 회원 인사이트
							</h4>
							<p className="text-xs text-blue-700 mb-2">
								전월 대비 신규 회원이{" "}
								<span className="font-medium">22.7%</span>{" "}
								증가했습니다.
							</p>
							<p className="text-xs text-blue-700">
								봉사 참여 회원 중{" "}
								<span className="font-medium">67%</span>는
								재방문하는 회원입니다.
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

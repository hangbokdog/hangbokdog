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
} from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import useCenterStore from "@/lib/store/centerStore";
import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCenterStatsAPI } from "@/api/center";

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

	const { data } = useQuery({
		queryKey: ["statsData"],
		queryFn: () => fetchCenterStatsAPI(selectedCenter?.centerId || ""),
		enabled: !!selectedCenter?.centerId,
	});

	// 실제로는 API로 데이터를 가져오겠지만, 여기서는 더미 데이터 사용
	const statsData = {
		totalDogs: 42,
		adopted: 15,
		sponsored: 23,
		underTreatment: 8,
		totalDonation: "1,850,000원",
		monthlyDonations: [
			125000, 140000, 130000, 185000, 210000, 175000, 145000, 160000,
			190000, 205000, 175000, 210000,
		],
		monthlySponsors: [8, 10, 9, 12, 15, 13, 10, 11, 14, 16, 13, 15],
		dogStatus: {
			available: 19,
			adopted: 15,
			underTreatment: 8,
		},
	};

	// 컴포넌트 마운트 시 로딩 애니메이션 추가
	useEffect(() => {
		const timer = setTimeout(() => setIsLoaded(true), 300);
		return () => clearTimeout(timer);
	}, []);

	// 선택된 월의 데이터 가져오기
	const getSelectedMonthData = () => {
		if (selectedMonth === null) return null;
		return {
			donationAmount: statsData.monthlyDonations[selectedMonth],
			sponsorCount: statsData.monthlySponsors[selectedMonth],
			month: months[selectedMonth],
		};
	};

	const selectedMonthData = getSelectedMonthData();

	// 도넛 차트 데이터
	const dogStatusData = {
		labels: ["입양 가능", "입양 완료", "치료 중"],
		datasets: [
			{
				data: [
					statsData.dogStatus.available,
					statsData.dogStatus.adopted,
					statsData.dogStatus.underTreatment,
				],
				backgroundColor: ["#4dabf7", "#51cf66", "#ff8787"],
				borderColor: ["#ffffff", "#ffffff", "#ffffff"],
				borderWidth: 2,
				borderRadius: 5,
				hoverOffset: 10,
			},
		],
	};

	// 월간 후원 차트 데이터
	const monthlyDonationData = {
		labels: months,
		datasets: [
			{
				label: "후원금",
				data: statsData.monthlyDonations,
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

	return (
		<div
			className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
		>
			<div className="mb-4">
				<h2 className="text-lg font-bold text-gray-800">
					{selectedCenter?.centerName || "센터"} 현황
				</h2>
				<p className="text-sm text-gray-500">
					전체 통계 및 현황을 확인해보세요
				</p>
			</div>

			{/* 통계 카드 그리드 */}
			<div className="grid grid-cols-2 gap-3 mb-5">
				<StatCard
					title="전체 아이들"
					value={statsData.totalDogs}
					trend="up"
					trendValue="+15%"
					icon={<MdOutlinePets className="size-5 text-blue-600" />}
					color="bg-blue-50"
				/>
				<StatCard
					title="결연 중"
					value={statsData.sponsored}
					trend="up"
					trendValue="+8%"
					icon={
						<MdVolunteerActivism className="size-5 text-green-600" />
					}
					color="bg-green-50"
				/>
				<StatCard
					title="입양 완료"
					value={statsData.adopted}
					trend="neutral"
					trendValue="유지"
					icon={<MdFavorite className="size-5 text-amber-600" />}
					color="bg-amber-50"
				/>
				<StatCard
					title="이번 달 총 후원"
					value={statsData.totalDonation}
					trend="up"
					trendValue="+12%"
					icon={<FaMoneyBillWave className="size-5 text-teal-600" />}
					color="bg-teal-50"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
				<h3 className="font-semibold mb-3 text-gray-700 flex items-center">
					<MdOutlinePets className="mr-1 text-blue-500" size={18} />
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

			{/* 월간 후원 현황 차트 */}
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<h3 className="font-semibold mb-2 text-gray-700 flex items-center justify-between">
					<span className="flex items-center">
						<FaMoneyBillWave
							className="mr-1 text-teal-600"
							size={16}
						/>
						월간 후원 현황
					</span>
					{selectedMonthData && (
						<button
							type="button"
							className="text-xs text-gray-500 hover:text-gray-700"
							onClick={() => setSelectedMonth(null)}
						>
							전체 보기
						</button>
					)}
				</h3>

				{/* 선택된 월 정보 표시 */}
				{selectedMonthData && (
					<div className="mb-4 p-3 bg-teal-50 rounded-lg">
						<h4 className="font-medium text-teal-700">
							{selectedMonthData.month} 후원 정보
						</h4>
						<div className="grid grid-cols-2 gap-2 mt-2">
							<div className="bg-white p-2 rounded-md">
								<p className="text-xs text-gray-500">후원금</p>
								<p className="text-lg font-medium text-teal-600">
									{selectedMonthData.donationAmount.toLocaleString()}
									원
								</p>
							</div>
							<div className="bg-white p-2 rounded-md">
								<p className="text-xs text-gray-500">후원자</p>
								<p className="text-lg font-medium text-teal-600">
									{selectedMonthData.sponsorCount}명
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="touch-pan-x" style={{ height: "220px" }}>
					<Line
						data={monthlyDonationData}
						// biome-ignore lint/suspicious/noExplicitAny: any
						options={monthlyDonationOptions as any}
					/>
				</div>

				<p className="text-xs text-gray-500 text-center mt-2">
					차트를 탭하면 해당 월의 상세 정보를 확인할 수 있습니다
				</p>

				{/* 월 선택 버튼 그룹 */}
				<div className="flex flex-wrap gap-2 mt-4 justify-center">
					{months.map((month, index) => (
						<button
							key={month}
							type="button"
							className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
								selectedMonth === index
									? "bg-teal-500 text-white"
									: index === currentMonth
										? "bg-teal-100 text-teal-700"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
							onClick={() => setSelectedMonth(index)}
						>
							{month}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

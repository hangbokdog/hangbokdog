import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
	MdOutlinePets,
	MdVolunteerActivism,
	MdFavorite,
	MdMedication,
} from "react-icons/md";
import useCenterStore from "@/lib/store/centerStore";
import { useState, useEffect, type ReactNode } from "react";

// Chart.js 컴포넌트 등록
ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
);

// 통계 카드 타입 정의
interface StatCardProps {
	title: string;
	value: number;
	icon: ReactNode;
	color: string;
}

export default function StatsPanel() {
	const { selectedCenter } = useCenterStore();
	const [isLoaded, setIsLoaded] = useState(false);

	// 실제로는 API로 데이터를 가져오겠지만, 여기서는 더미 데이터 사용
	const statsData = {
		totalDogs: 42,
		adopted: 15,
		sponsored: 23,
		needsMedication: 8,
		recentAdoptions: [2, 3, 1, 0, 4, 2, 3],
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

	// 막대 차트 데이터
	const adoptionTrendData = {
		labels: ["월", "화", "수", "목", "금", "토", "일"],
		datasets: [
			{
				label: "주간 입양 현황",
				data: statsData.recentAdoptions,
				backgroundColor: "#4dabf7",
				borderRadius: 8,
			},
		],
	};

	const adoptionTrendOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					precision: 0,
				},
			},
		},
	};

	// 통계 카드 컴포넌트
	const StatCard = ({ title, value, icon, color }: StatCardProps) => (
		<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-gray-500 text-sm mb-1">{title}</p>
					<p className="text-2xl font-bold">{value}</p>
				</div>
				<div className={`p-3 rounded-xl ${color}`}>{icon}</div>
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
					icon={<MdOutlinePets className="size-6 text-blue-600" />}
					color="bg-blue-50"
				/>
				<StatCard
					title="결연 중"
					value={statsData.sponsored}
					icon={
						<MdVolunteerActivism className="size-6 text-green-600" />
					}
					color="bg-green-50"
				/>
				<StatCard
					title="입양 완료"
					value={statsData.adopted}
					icon={<MdFavorite className="size-6 text-amber-600" />}
					color="bg-amber-50"
				/>
				<StatCard
					title="투약 필요"
					value={statsData.needsMedication}
					icon={<MdMedication className="size-6 text-red-600" />}
					color="bg-red-50"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-5">
				<h3 className="font-semibold mb-3 text-gray-700">
					아이들 현황
				</h3>
				<div
					className="w-full flex justify-center mb-2"
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

			{/* 주간 입양 현황 차트 */}
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
				<h3 className="font-semibold mb-3 text-gray-700">
					주간 입양 현황
				</h3>
				<div style={{ height: "200px" }}>
					<Bar
						data={adoptionTrendData}
						options={adoptionTrendOptions}
					/>
				</div>
			</div>
		</div>
	);
}

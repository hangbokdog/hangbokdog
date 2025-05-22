import { useAllVolunteerApplications } from "@/lib/hooks/useMyAllVolunteerApplications";
import VolunteerTag from "./VolunteerTag";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function MyOngoingVolunteer() {
	const { data, isLoading, error } = useAllVolunteerApplications();
	const [currentIndex, setCurrentIndex] = useState(0);

	if (isLoading) return <div className="p-4">불러오는 중...</div>;
	if (error || !data)
		return <div className="p-4">신청 내역을 불러올 수 없습니다.</div>;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const flatList = data.flatMap(({ data }: any) => data);
	const total = flatList.length;

	const handlePrev = () => {
		if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
	};

	const handleNext = () => {
		if (currentIndex < total - 1) setCurrentIndex((prev) => prev + 1);
	};

	return (
		<div className="mx-2.5 mb-4 space-y-4">
			<div className="flex items-center">
				<div className="bg-blueGray h-5 w-1 rounded-full mr-2" />
				<h3 className="text-lg font-bold">내 봉사 신청 목록</h3>
			</div>

			{/* 캐러셀 영역 */}
			<div className="relative">
				{/* 슬라이드 트랙 */}
				<div className="overflow-hidden">
					<div
						className="flex transition-transform duration-300 ease-in-out"
						style={{
							transform: `translateX(-${currentIndex * 100}%)`,
						}}
					>
						{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
						{flatList.map((item: any) => (
							<div
								key={item.volunteerEventId}
								className="w-full flex-shrink-0 px-1"
							>
								<div className="border rounded-lg px-4 py-3 shadow-sm bg-white">
									<div className="flex justify-between items-center mb-1">
										<span className="font-semibold text-gray-800">
											{item.title}
										</span>
										<VolunteerTag status={item.status} />
									</div>
									<div className="text-sm text-gray-500">
										신청일: {item.date}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<button
					type="button"
					onClick={handlePrev}
					disabled={currentIndex === 0}
					className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-50 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
				>
					<FaChevronLeft />
				</button>

				<button
					type="button"
					onClick={handleNext}
					disabled={currentIndex === total - 1}
					className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-50 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
				>
					<FaChevronRight />
				</button>
			</div>

			{/* 인디케이터 */}
			{/* <div className="text-center text-sm text-gray-500">
				{currentIndex + 1} / {total}
			</div> */}
		</div>
	);
}

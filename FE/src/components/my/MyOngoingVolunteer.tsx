import { useAllVolunteerApplications } from "@/lib/hooks/useMyAllVolunteerApplications";
import VolunteerTag from "./VolunteerTag";

export default function MyOngoingVolunteer() {
	const { data, isLoading, error } = useAllVolunteerApplications();

	if (isLoading) return <div className="p-4">불러오는 중...</div>;
	if (error || !data)
		return <div className="p-4">신청 내역을 불러올 수 없습니다.</div>;

	// 🔄 모든 상태 리스트를 하나로 합치기
	const flatList = data.flatMap(({ data }) => data);

	return (
		<div className="space-y-8 mx-2.5">
			<h2 className="font-bold text-grayText">내 봉사 신청 목록</h2>
			<ul className="space-y-2">
				{flatList.map((item) => (
					<li
						key={item.volunteerEventId}
						className="border rounded-lg px-4 py-3 shadow-sm bg-white"
					>
						<div className="flex justify-between items-center mb-1">
							<span className="font-semibold text-gray-800">
								{item.title}
							</span>
							<VolunteerTag status={item.status} />
						</div>
						<div className="text-sm text-gray-500">
							신청일: {item.date}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

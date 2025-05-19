import { useQuery } from "@tanstack/react-query";
import { getMyVolunteerApplicationsListAPI } from "@/api/volunteer";
import type { MyVolunteerListApplication } from "@/api/volunteer";

export default function MyOngoingVolunteer() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["my-volunteer-applications", "PENDING"],
		queryFn: () => getMyVolunteerApplicationsListAPI({ status: "PENDING" }),
		staleTime: 1000 * 60 * 5,
	});

	if (isLoading) return <div className="p-4">불러오는 중...</div>;
	if (error || !data)
		return <div className="p-4">신청 내역을 불러올 수 없습니다.</div>;

	return (
		<div className="space-y-4 p-4">
			<h2 className="text-xl font-semibold">
				내 봉사 신청 목록 ({data.count}건)
			</h2>
			<ul className="space-y-2">
				{data.memberApplicationInfo.map((item) => (
					<li
						key={item.volunteerEventId}
						className="border rounded-xl px-4 py-3 shadow-sm bg-white"
					>
						<div className="flex justify-between items-center mb-1">
							<span className="font-semibold text-gray-800">
								{item.title}
							</span>
							<span className="text-sm text-blue-600">
								{item.status}
							</span>
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

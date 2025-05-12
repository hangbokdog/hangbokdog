import {
	type CenterJoinRequestResponse,
	fetchCenterJoinRequestAPI,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function RequestPanel() {
	const { selectedCenter } = useCenterStore();
	const [pageToken, setPageToken] = useState<string>();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["centerJoinRequest", selectedCenter?.centerId, pageToken],
		queryFn: () =>
			fetchCenterJoinRequestAPI(
				selectedCenter?.centerId as string,
				pageToken,
			),
		enabled: !!selectedCenter?.centerId,
	});

	return (
		<div className="flex flex-col bg-white rounded-lg shadow-custom-sm p-4 text-grayText font-semibold gap-2">
			<div className="text-lg font-bold">센터 가입 요청</div>
			{isLoading && (
				<p className="text-sm text-gray-400">불러오는 중...</p>
			)}
			{isError && <p className="text-sm text-red-500">불러오기 실패</p>}

			<ul className="mt-2 flex flex-col gap-2">
				{data?.data.map((req: CenterJoinRequestResponse) => (
					<li
						key={req.centerJoinRequestId}
						className="text-sm border p-2 rounded"
					>
						{req.name}
					</li>
				))}
			</ul>

			{data?.pageToken && (
				<button
					type="button"
					className="mt-2 self-end text-sm text-blue-500"
					onClick={() => setPageToken(data.pageToken || "")}
				>
					다음 페이지 →
				</button>
			)}
		</div>
	);
}

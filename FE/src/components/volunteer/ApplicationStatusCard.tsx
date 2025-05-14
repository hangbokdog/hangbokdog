import { Clock, Check, CalendarCheck } from "lucide-react";

export default function ApplicationStatusCard({
	status,
	date,
	time,
}: {
	status: "PENDING" | "APPROVED";
	date: string;
	time: string;
}) {
	if (status === "PENDING") {
		return (
			<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 shadow-sm">
				<div className="flex items-center gap-3 mb-3">
					<div className="p-2 bg-amber-100 rounded-full">
						<Clock className="w-5 h-5 text-amber-600" />
					</div>
					<h3 className="text-lg font-semibold text-amber-800">
						신청 승인 대기 중
					</h3>
				</div>
				<p className="text-sm text-amber-700 mb-2 pl-10">
					센터 관리자의 승인을 기다리고 있습니다.
				</p>
				<div className="bg-white rounded-md p-3 mt-2">
					<div className="flex justify-between text-sm text-gray-600">
						<span>신청 날짜:</span>
						<span className="font-medium">{date}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600 mt-2">
						<span>신청 시간:</span>
						<span className="font-medium">{time}</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 shadow-sm">
			<div className="flex items-center gap-3 mb-3">
				<div className="p-2 bg-green-100 rounded-full">
					<Check className="w-5 h-5 text-green-600" />
				</div>
				<h3 className="text-lg font-semibold text-green-800">
					봉사 참여 확정
				</h3>
			</div>
			<p className="text-sm text-green-700 mb-2 pl-10">
				신청이 승인되었습니다. 아래 일정에 참여해 주세요.
			</p>
			<div className="bg-white rounded-md p-3 mt-2">
				<div className="flex justify-between text-sm text-gray-600">
					<span>참여 날짜:</span>
					<span className="font-medium">{date}</span>
				</div>
				<div className="flex justify-between text-sm text-gray-600 mt-2">
					<span>참여 시간:</span>
					<span className="font-medium">{time}</span>
				</div>
			</div>
			<button
				type="button"
				className="w-full rounded-md bg-green-600 hover:bg-green-700 text-white py-2 mt-3 flex items-center justify-center gap-2 transition-colors"
			>
				<CalendarCheck className="w-4 h-4" />
				<span>일정에 추가하기</span>
			</button>
		</div>
	);
}

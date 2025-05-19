import { CalendarCheck, Clock } from "lucide-react";

interface VolunteerRecordProps {
	id: number;
	date: string;
	centerName: string;
	hours: number;
	status: "completed" | "upcoming" | "cancelled";
}

const VolunteerRecord = ({
	date,
	centerName,
	hours,
	status,
}: VolunteerRecordProps) => {
	const statusColors = {
		completed: "bg-green-100 text-green-800",
		upcoming: "bg-blue-100 text-blue-800",
		cancelled: "bg-red-100 text-red-800",
	};

	const statusText = {
		completed: "완료",
		upcoming: "예정",
		cancelled: "취소됨",
	};

	return (
		<div className="flex items-center justify-between p-3 border rounded-lg mb-2 hover:shadow-sm transition-shadow">
			<div className="flex flex-col">
				<div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
					<CalendarCheck className="w-4 h-4" />
					<span>{date}</span>
				</div>
				<div className="font-medium">{centerName}</div>
			</div>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1 text-sm text-gray-600">
					<Clock className="w-4 h-4" />
					<span>{hours}시간</span>
				</div>
				<div
					className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}
				>
					{statusText[status]}
				</div>
			</div>
		</div>
	);
};

export default function VolunteerTabContent() {
	// Dummy data for volunteering records
	const volunteerRecords: VolunteerRecordProps[] = [
		{
			id: 1,
			date: "2024.06.21",
			centerName: "행복한 보호소",
			hours: 3,
			status: "upcoming",
		},
		{
			id: 2,
			date: "2024.05.15",
			centerName: "강아지 천국",
			hours: 2,
			status: "completed",
		},
		{
			id: 3,
			date: "2024.04.03",
			centerName: "사랑의 보호소",
			hours: 4,
			status: "completed",
		},
		{
			id: 4,
			date: "2024.03.20",
			centerName: "강아지 천국",
			hours: 3,
			status: "cancelled",
		},
	];

	// If no records, show empty state
	if (volunteerRecords.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-gray-500 whitespace-pre-line">
					아직 봉사 기록이 없어요.\n새로운 봉사 활동에 참여해보세요!
				</p>
			</div>
		);
	}

	return (
		<div className="p-2">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-medium">봉사 활동 내역</h3>
				<div className="text-sm font-bold text-male">
					총 {volunteerRecords.length}회
				</div>
			</div>

			<div className="space-y-2">
				{volunteerRecords.map((record) => (
					<VolunteerRecord key={record.id} {...record} />
				))}
			</div>
		</div>
	);
}

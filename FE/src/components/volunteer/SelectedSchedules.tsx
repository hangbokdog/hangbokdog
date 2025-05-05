import ParticipantForm from "./ParticipantForm";
import type { Participant, SelectedSchedule } from "@/types/volunteer";

interface SelectedSchedulesProps {
	selectedSchedules: SelectedSchedule[];
	onScheduleRemove: (date: string, time: "morning" | "afternoon") => void;
	onPeopleCountChange: (
		scheduleIndex: number,
		action: "increase" | "decrease",
	) => void;
	onNicknameSearch: (
		scheduleIndex: number,
		participantIndex: number,
		nickname: string,
	) => void;
}

export default function SelectedSchedules({
	selectedSchedules,
	onScheduleRemove,
	onPeopleCountChange,
	onNicknameSearch,
}: SelectedSchedulesProps) {
	if (selectedSchedules.length === 0) {
		return null;
	}

	return (
		<div className="mt-6">
			<h3 className="text-lg font-bold mb-2">선택된 일정</h3>
			{selectedSchedules.map((schedule, scheduleIndex) => (
				<div
					key={`${schedule.date}-${schedule.time}`}
					className="mb-6 rounded-[8px] p-4 bg-white shadow-custom-sm"
				>
					<div className="flex justify-between items-center mb-3">
						<div className="font-medium">
							{schedule.date}{" "}
							{schedule.time === "morning" ? "오전" : "오후"} (
							{schedule.capacity})
						</div>
						<button
							type="button"
							className="bg-red-500 text-white text-xs rounded-md px-2 py-1"
							onClick={() =>
								onScheduleRemove(schedule.date, schedule.time)
							}
						>
							삭제
						</button>
					</div>

					<div className="flex items-center mb-4">
						<div className="flex-1">
							<h4 className="font-bold">인원수</h4>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
								onClick={() =>
									onPeopleCountChange(
										scheduleIndex,
										"decrease",
									)
								}
								disabled={schedule.people <= 1}
							>
								-
							</button>
							<span className="w-8 text-center font-medium">
								{schedule.people}
							</span>
							<button
								type="button"
								className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
								onClick={() =>
									onPeopleCountChange(
										scheduleIndex,
										"increase",
									)
								}
								disabled={
									schedule.people >=
									Number(schedule.capacity.split("/")[1]) -
										Number(schedule.capacity.split("/")[0])
								}
							>
								+
							</button>
						</div>
					</div>

					<div className="space-y-4">
						{schedule.participants.map(
							(participant, participantIndex) => (
								<div
									key={`schedule-${scheduleIndex}-participant-${
										participant.nickname || participantIndex
									}`}
									className="p-4 border rounded-md bg-background"
								>
									<p className="mb-3 font-medium text-sm">
										{participantIndex + 1}.{" "}
										{participantIndex === 0
											? "신청자 정보"
											: "동행자 정보"}
									</p>
									<ParticipantForm
										scheduleIndex={scheduleIndex}
										participantIndex={participantIndex}
										participant={participant}
										onNicknameSearch={onNicknameSearch}
									/>
								</div>
							),
						)}
					</div>
				</div>
			))}
		</div>
	);
}

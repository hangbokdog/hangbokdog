import { useState } from "react";
import VolunteerScheduleTable from "@/components/volunteer/VolunteerScheduleTable";
import SelectedSchedules from "@/components/volunteer/SelectedSchedules";
import type {
	Participant,
	ScheduleItem,
	SelectedSchedule,
} from "@/types/volunteer";

export default function VolunteerApplyPage() {
	const [scheduleData] = useState<ScheduleItem[]>([
		{ date: "4.14(월)", morning: "1/6", afternoon: "1/6" },
		{ date: "4.15(화)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.16(수)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.17(목)", morning: "0/6", afternoon: "1/6" },
		{ date: "4.18(금)", morning: "1/6", afternoon: "3/6" },
		{ date: "4.19(토)", morning: "4/6", afternoon: "6/6" },
		{ date: "4.20(일)", morning: "6/6", afternoon: "3/6" },
	]);

	// Store primary user info separately to persist between schedule changes
	const [primaryUser, setPrimaryUser] = useState<Participant>({
		nickname: "raonrabbit",
		name: "홍*동",
		phone: "010-****-4887",
	});

	const [selectedSchedules, setSelectedSchedules] = useState<
		SelectedSchedule[]
	>([
		{
			date: "4.14(월)",
			time: "morning",
			capacity: "1/6",
			people: 1,
			participants: [
				{
					nickname: "raonrabbit",
					name: "홍*동",
					phone: "010-****-4887",
				},
			],
		},
		{
			date: "4.17(목)",
			time: "afternoon",
			capacity: "1/6",
			people: 2,
			participants: [
				{
					nickname: "raonrabbit",
					name: "홍*동",
					phone: "010-****-4887",
				},
				{ nickname: "", name: "", phone: "" },
			],
		},
	]);

	const handleScheduleSelect = (
		date: string,
		time: "morning" | "afternoon",
		capacity: string,
	) => {
		// Check if slot is full
		const [current, max] = capacity.split("/");
		if (Number.parseInt(current) >= Number.parseInt(max)) return;

		// Check if already selected
		const isSelected = selectedSchedules.some(
			(item) => item.date === date && item.time === time,
		);

		if (!isSelected) {
			setSelectedSchedules([
				...selectedSchedules,
				{
					date,
					time,
					capacity,
					people: 1,
					participants: [{ ...primaryUser }],
				},
			]);
		}
	};

	const handleScheduleRemove = (
		date: string,
		time: "morning" | "afternoon",
	) => {
		setSelectedSchedules(
			selectedSchedules.filter(
				(item) => !(item.date === date && item.time === time),
			),
		);
	};

	const handlePeopleCountChange = (
		scheduleIndex: number,
		action: "increase" | "decrease",
	) => {
		const updatedSchedules = [...selectedSchedules];
		const schedule = updatedSchedules[scheduleIndex];

		if (action === "increase") {
			// Parse capacity string to get current and max values
			const [current, max] = schedule.capacity.split("/").map(Number);
			const remainingSlots = max - current;

			// Only allow increase if people count is less than remaining slots
			if (schedule.people < remainingSlots) {
				schedule.people += 1;
				schedule.participants.push({
					nickname: "",
					name: "",
					phone: "",
				});
			}
		} else if (action === "decrease" && schedule.people > 1) {
			schedule.people -= 1;
			schedule.participants.pop();
		}

		setSelectedSchedules(updatedSchedules);
	};

	const handleNicknameSearch = (
		scheduleIndex: number,
		participantIndex: number,
		nickname: string,
	) => {
		// TODO: API call to search for nickname
		if (nickname.trim() !== "") {
			setTimeout(() => {
				const updatedSchedules = [...selectedSchedules];
				updatedSchedules[scheduleIndex].participants[participantIndex] =
					{
						nickname,
						name: `테스트유저${participantIndex + 1}`,
						phone: `010-${1000 + participantIndex}-${5678}`,
					};

				// If this is the primary user, update the primaryUser state
				if (participantIndex === 0) {
					const newPrimaryUser =
						updatedSchedules[scheduleIndex].participants[0];
					setPrimaryUser(newPrimaryUser);

					// Update primary user across all schedules
					for (const schedule of updatedSchedules) {
						schedule.participants[0] = { ...newPrimaryUser };
					}
				}

				setSelectedSchedules(updatedSchedules);
			}, 500);
		}
	};

	const handleParticipantChange = (
		scheduleIndex: number,
		participantIndex: number,
		field: keyof Participant,
		value: string,
	) => {
		const updatedSchedules = [...selectedSchedules];
		updatedSchedules[scheduleIndex].participants[participantIndex][field] =
			value;

		// If this is the primary user, update the primaryUser state
		if (participantIndex === 0) {
			const newPrimaryUser = { ...primaryUser, [field]: value };
			setPrimaryUser(newPrimaryUser);

			// Update primary user across all schedules
			for (const schedule of updatedSchedules) {
				schedule.participants[0] = { ...newPrimaryUser };
			}
		}

		setSelectedSchedules(updatedSchedules);
	};

	const isFormComplete = () => {
		if (selectedSchedules.length === 0) return false;

		// Check if all participants data is filled in all schedules
		return selectedSchedules.every((schedule) =>
			schedule.participants.every(
				(participant) =>
					participant.nickname.trim() !== "" &&
					participant.name.trim() !== "" &&
					participant.phone.trim() !== "",
			),
		);
	};

	const isComplete = isFormComplete();

	return (
		<div className="flex flex-col p-2.5 gap-4 mt-2.5">
			<span className="text-xl font-bold">일정 선택</span>
			<span className="text-sm text-primary">
				원하시는 날짜를 클릭해주세요!
			</span>

			<VolunteerScheduleTable
				scheduleData={scheduleData}
				selectedSchedules={selectedSchedules}
				onScheduleSelect={handleScheduleSelect}
			/>

			<SelectedSchedules
				selectedSchedules={selectedSchedules}
				onScheduleRemove={handleScheduleRemove}
				onPeopleCountChange={handlePeopleCountChange}
				onNicknameSearch={handleNicknameSearch}
			/>

			<div className="flex justify-center">
				<button
					type="button"
					className={`${
						isComplete
							? "bg-main text-white"
							: "bg-superLightGray text-grayText cursor-not-allowed"
					} rounded-full py-3 px-4 font-medium transition-colors`}
					disabled={!isComplete}
				>
					신청하기
				</button>
			</div>
		</div>
	);
}

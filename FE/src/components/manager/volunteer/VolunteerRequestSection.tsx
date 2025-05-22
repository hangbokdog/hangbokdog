import { useState } from "react";
import VolunteerMemberSection from "./VolunteerMemberSection";
import { MdCheck } from "react-icons/md";

interface VolunteerRequestSectionProps {
	selectedDate?: Date;
}

const members = {
	day: ["최준혁 님"],
	morning: ["홍길금 님", "홍길은 님"],
	night: ["이재백 님", "김민지 님"],
};

const volunteerRequests = [
	{
		name: "김민지 님",
		memberCount: 2,
		time: "오후",
	},
	{
		name: "이재백 님",
		memberCount: 1,
		time: "오전",
	},
];

export default function VolunteerRequestSection({
	selectedDate,
}: VolunteerRequestSectionProps) {
	const [addedMorningMembers, setAddedMorningMembers] = useState<string[]>(
		[],
	);
	const [addedNightMembers, setAddedNightMembers] = useState<string[]>([]);
	const [selectedNames, setSelectedNames] = useState<string[]>([]);

	const handleRequestClick = (
		request: (typeof volunteerRequests)[number],
	) => {
		const { name, time } = request;

		const addIfNotExists = (
			list: string[],
			setter: (m: string[]) => void,
		) => {
			if (!list.includes(name)) {
				setter([...list, name]);
			}
		};

		const removeIfExists = (
			list: string[],
			setter: (m: string[]) => void,
		) => {
			setter(list.filter((item) => item !== name));
		};

		if (selectedNames.includes(name)) {
			setSelectedNames((prev) => prev.filter((n) => n !== name));
			if (time === "종일") {
				removeIfExists(addedMorningMembers, setAddedMorningMembers);
				removeIfExists(addedNightMembers, setAddedNightMembers);
			} else if (time === "오전") {
				removeIfExists(addedMorningMembers, setAddedMorningMembers);
			} else if (time === "오후") {
				removeIfExists(addedNightMembers, setAddedNightMembers);
			}
		} else {
			setSelectedNames((prev) => [...prev, name]);
			if (time === "종일") {
				addIfNotExists(addedMorningMembers, setAddedMorningMembers);
				addIfNotExists(addedNightMembers, setAddedNightMembers);
			} else if (time === "오전") {
				addIfNotExists(addedMorningMembers, setAddedMorningMembers);
			} else if (time === "오후") {
				addIfNotExists(addedNightMembers, setAddedNightMembers);
			}
		}
	};

	const handleToggleAll = () => {
		if (selectedNames.length === volunteerRequests.length) {
			setSelectedNames([]);
			setAddedMorningMembers([]);
			setAddedNightMembers([]);
		} else {
			const newSelected = volunteerRequests.map((r) => r.name);
			setSelectedNames(newSelected);
			setAddedMorningMembers([
				...new Set(
					volunteerRequests
						.filter((r) => r.time === "종일" || r.time === "오전")
						.map((r) => r.name),
				),
			]);
			setAddedNightMembers([
				...new Set(
					volunteerRequests
						.filter((r) => r.time === "종일" || r.time === "오후")
						.map((r) => r.name),
				),
			]);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<VolunteerMemberSection
				label="오전"
				colorKey="morning"
				allDayMembers={members.day}
				maxMemberCount={4}
				members={members.morning}
				addedMembers={addedMorningMembers}
			/>
			<VolunteerMemberSection
				label="오후"
				colorKey="night"
				allDayMembers={members.day}
				maxMemberCount={3}
				members={members.night}
				addedMembers={addedNightMembers}
			/>
			<div className="flex flex-col gap-3 text-grayText bg-background rounded-lg p-3">
				<button
					type="button"
					className="text-sm text-grayText w-fit"
					onClick={handleToggleAll}
				>
					{selectedNames.length === volunteerRequests.length
						? "전체 해제"
						: "전체 선택"}
				</button>
				<div>
					{volunteerRequests.map((request, index) => {
						const isSelected = selectedNames.includes(request.name);
						return (
							<div
								key={`${request.name}-${index}`}
								onClick={() => handleRequestClick(request)}
								onKeyDown={(e) =>
									e.key === "Enter" &&
									handleRequestClick(request)
								}
								className={`cursor-pointer flex px-4 py-2 rounded-full text-sm font-semibold ${
									isSelected ? "bg-blue-50" : ""
								}`}
							>
								<span className="w-18 border-r-1 border-lightGray">
									{request.name}
								</span>
								<span className="flex gap-2 flex-1 pl-4">
									<span className="text-blueGray">
										{request.memberCount}명
									</span>
									<span className="text-blueGray">
										{request.time}
									</span>
								</span>
								<span className="flex items-center">
									<MdCheck
										className={`text-lg ${
											isSelected
												? "text-blueGray"
												: "text-superLightGray"
										}`}
									/>
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

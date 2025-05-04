import { useEffect, useState } from "react";
import type { Participant } from "@/types/volunteer";

interface ParticipantFormProps {
	scheduleIndex: number;
	participantIndex: number;
	participant: Participant;
	onNicknameSearch: (
		scheduleIndex: number,
		participantIndex: number,
		nickname: string,
	) => void;
}

export default function ParticipantForm({
	scheduleIndex,
	participantIndex,
	participant,
	onNicknameSearch,
}: ParticipantFormProps) {
	const [inputValue, setInputValue] = useState(participant.nickname);
	const [isSearched, setIsSearched] = useState(!!participant.name);

	// Sync input value with participant when it changes from outside
	useEffect(() => {
		setInputValue(participant.nickname);
		// If participant has a name, it means search was successful
		setIsSearched(!!participant.name);
	}, [participant.nickname, participant.name]);

	if (participantIndex === 0) {
		return (
			<div className="flex flex-col space-y-3">
				<div className="flex items-center">
					<span className="font-bold flex-1">닉네임</span>
					<span className="flex-2">{participant.nickname}</span>
				</div>
				<div className="flex items-center">
					<span className="font-bold flex-1">이름</span>
					<span className="flex-2">{participant.name}</span>
				</div>
				<div className="flex items-center">
					<span className="font-bold flex-1">연락처</span>
					<span className="flex-2">{participant.phone}</span>
				</div>
			</div>
		);
	}

	const isValidNickname =
		inputValue.trim().length >= 2 && inputValue.trim().length <= 10;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isSearched) {
			setInputValue(e.target.value);
		}
	};

	const handleSearch = () => {
		if (isValidNickname) {
			onNicknameSearch(
				scheduleIndex,
				participantIndex,
				inputValue.trim(),
			);
		}
	};

	return (
		<div className="flex flex-col space-y-3">
			<div className="flex items-center gap-2">
				<label
					htmlFor={`schedule-${scheduleIndex}-nickname-${participantIndex}`}
					className="font-bold w-20"
				>
					닉네임
				</label>
				<div className="flex-1 flex gap-2">
					<input
						id={`schedule-${scheduleIndex}-nickname-${participantIndex}`}
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="닉네임 검색"
						className={`flex-1 px-3 py-2 border rounded-md text-sm ${
							isSearched ? "bg-superLightGray" : "bg-white"
						}`}
						maxLength={10}
						minLength={2}
						readOnly={isSearched}
					/>
					<button
						type="button"
						onClick={handleSearch}
						disabled={!isValidNickname || isSearched}
						className={`${
							isValidNickname && !isSearched
								? "bg-primary text-white"
								: "bg-superLightGray text-grayText cursor-not-allowed"
						} px-3 py-1 rounded-md text-sm whitespace-nowrap`}
					>
						검색
					</button>
				</div>
			</div>

			<div className="flex items-center">
				<span className="font-bold w-20">이름</span>
				<span className="flex-1 text-gray-500">
					{participant.name || "-"}
				</span>
			</div>

			<div className="flex items-center">
				<span className="font-bold w-20">연락처</span>
				<span className="flex-1 text-gray-500">
					{participant.phone || "-"}
				</span>
			</div>
		</div>
	);
}

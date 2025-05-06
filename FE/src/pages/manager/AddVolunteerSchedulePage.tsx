import ComboBox from "@/components/ui/comboBox";
import { useState } from "react";
import ReactQuill from "react-quill-new";

export default function AddVolunteerSchedule() {
	const places = [
		{
			value: "쉼터",
			label: "쉼터",
		},
		{
			value: "쉼뜰",
			label: "쉼뜰",
		},
		{
			value: "입양뜰",
			label: "입양뜰",
		},
	];

	const [selectedPlace, setSelectedPlace] = useState(places[0]);

	const handleComboBoxSelect = (selectedValue: string) => {
		const place = places.find((r) => r.value === selectedValue);
		if (place) {
			setSelectedPlace(place);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-white text-grayText font-medium">
			<div className="flex-1 p-4 flex flex-col gap-5 overflow-auto">
				<div className="text-xl font-bold">봉사 일정 생성</div>

				<div className="flex flex-col gap-3">
					<label htmlFor="date" className="text-lg">
						일시
					</label>
					<div className="flex gap-4 items-center">
						<input
							id="start-date"
							type="date"
							className="border p-1 rounded"
						/>
						~
						<input
							id="end-date"
							type="date"
							className="border p-1 rounded"
						/>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<label htmlFor="max-volunteer" className="text-lg">
						인원수
					</label>
					<input
						type="number"
						id="max-volunteer"
						className="border border-gray-300 rounded p-2"
						placeholder="인원수를 입력하세요."
					/>
				</div>

				<div className="flex flex-col gap-3">
					<label htmlFor="location" className="text-lg">
						장소
					</label>
					<ComboBox
						items={places}
						defaultText={"장소를 선택하세요."}
						selectedValue={selectedPlace.value}
						onSelect={handleComboBoxSelect}
						variant="simple"
					/>
				</div>

				<label htmlFor="text" className="text-lg">
					내용
				</label>
				<ReactQuill theme="snow" />
			</div>

			<div className="sticky bottom-0 bg-white p-4 border-t">
				<button
					type="button"
					className="w-full bg-male text-white rounded-full p-3 hover:bg-blue"
				>
					추가하기
				</button>
			</div>
		</div>
	);
}

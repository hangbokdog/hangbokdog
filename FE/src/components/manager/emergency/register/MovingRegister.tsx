import { useState } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";
import useCenterStore from "@/lib/store/centerStore";
import { createPostTypeAPI, createPostAPI } from "@/api/emergencyRegister";

export default function MovingRegister() {
	const [formData, setFormData] = useState({
		id: "",
		currentLocation: "",
		destinationLocation: "",
		date: "",
		reason: "",
	});

	const { selectedCenter } = useCenterStore();
	const centerId = Number(selectedCenter?.centerId);

	console.log("현재 선택된 센터 ID:", selectedCenter?.centerId);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!centerId) {
			alert("센터가 선택되지 않았습니다.");
			return;
		}

		try {
			// 1. 게시판 생성
			const postType = await createPostTypeAPI(centerId, {
				name: "이동등록",
				// description: "아이 이동 등록용 게시판입니다.",
			});

			// 2. 게시글 생성
			const post = await createPostAPI({
				postTypeId: postType.id,
				title: "아이 이동 등록",
				content: `
          🐶 아이 ID: ${formData.id}
          📍 현재 위치: ${formData.currentLocation}
          🚚 이동 위치: ${formData.destinationLocation}
          📅 이동 일시: ${formData.date}
          ✏️ 사유: ${formData.reason}
        `,
			});

			console.log("게시글 등록 성공:", post);
			alert("등록이 완료되었습니다!");

			// 초기화
			setFormData({
				id: "",
				currentLocation: "",
				destinationLocation: "",
				date: "",
				reason: "",
			});
		} catch (error) {
			console.error("등록 실패:", error);
			alert("등록에 실패했습니다.");
		}
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* id 필드 */}
				<Field
					label="아이"
					name="id"
					value={formData.id}
					onChange={handleChange}
					onIconClick={() => console.log("아이 검색")}
				/>

				{/* currentLocation 필드 */}
				<Field
					label="현위치"
					name="currentLocation"
					value={formData.currentLocation}
					onChange={handleChange}
					onIconClick={() => console.log("현위치 검색")}
				/>

				{/* destinationLocation 필드 */}
				<Field
					label="이동 위치"
					name="destinationLocation"
					value={formData.destinationLocation}
					onChange={handleChange}
					onIconClick={() => console.log("이동 위치 검색")}
				/>

				{/* date 필드 */}
				<Field
					label="일시"
					name="date"
					value={formData.date}
					onChange={handleChange}
					icon={<CalendarIcon className="h-5 w-5 text-gray-500" />}
					onIconClick={() => console.log("달력 열기")}
				/>

				{/* reason 필드 */}
				<div>
					<div className="block text-gray-700 text-lg font-medium mb-2">
						사유
					</div>
					<textarea
						name="reason"
						value={formData.reason}
						onChange={handleChange}
						rows={6}
						className="w-full border rounded-xl border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-full transition duration-200"
					>
						등록하기
					</button>
				</div>
			</form>
		</div>
	);
}

// 🔧 공통 input 필드 컴포넌트
function Field({
	label,
	name,
	value,
	onChange,
	icon = <SearchIcon className="h-5 w-5 text-gray-500" />,
	onIconClick,
}: {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	icon?: React.ReactNode;
	onIconClick: () => void;
}) {
	return (
		<div>
			<label
				htmlFor={name}
				className="block text-gray-700 text-lg font-medium mb-2"
			>
				{label}
			</label>
			<div className="relative">
				<input
					type="text"
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className="w-full border bg-background rounded-xl border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="button"
					className="absolute right-2 top-1/2 transform -translate-y-1/2"
					onClick={onIconClick}
					aria-label={`${label} 검색`}
				>
					{icon}
				</button>
			</div>
		</div>
	);
}

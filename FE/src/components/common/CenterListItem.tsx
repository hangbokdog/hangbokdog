import useCenterStore from "@/lib/store/centerStore";
import { useNavigate } from "react-router-dom";

interface CenterListItemProps {
	centerId: string;
	centerName: string;
	status: string;
	index: number;
}

export default function CenterListItem({
	centerId,
	centerName,
	status,
	index,
}: CenterListItemProps) {
	const { setSelectedCenter } = useCenterStore();
	const navigate = useNavigate();

	const handleRegister = () => {
		console.log("Register clicked for center:", centerId);
	};

	const handleVisit = () => {
		setSelectedCenter(Number(centerId));
		navigate("/");
	};

	return (
		<div
			className={`${index % 2 === 0 && "bg-superLightBlueGray"} rounded-full h-10 w-full flex justify-between items-center p-4 hover:shadow-custom-sm`}
		>
			{centerName}
			<span className="flex gap-2.5">
				<span>
					{status === "가입신청" && (
						<button
							type="button"
							className="bg-male rounded-full text-white px-4 py-1 text-sm font-semibold"
							onClick={handleRegister}
						>
							가입 신청
						</button>
					)}
				</span>
				<span>
					{status === "가입신청" && (
						<button
							type="button"
							className="bg-blueGray rounded-full text-white px-4 py-1 text-sm font-semibold"
							onClick={handleVisit}
						>
							방문하기
						</button>
					)}
				</span>
			</span>
		</div>
	);
}

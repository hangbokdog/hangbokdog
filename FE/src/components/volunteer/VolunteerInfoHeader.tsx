import useCenterStore from "@/lib/store/centerStore";
import { MdEditNote } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

interface VolunteerInfoHeaderProps {
	title: string;
	status: string;
	date: string;
	location: string;
	addressName: string;
	time: string;
	pets: string;
	id: number;
}

export default function VolunteerInfoHeader({
	title,
	status,
	date,
	location,
	addressName,
	time,
	pets,
	id,
}: VolunteerInfoHeaderProps) {
	const isManager = useCenterStore().selectedCenter?.status === "MANAGER";
	const navigate = useNavigate();

	return (
		<div className="flex flex-col p-2.5 gap-2.5 bg-white rounded-[8px] shadow-custom-sm">
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span className="text-xl font-bold">{title}</span>
					{status === "마감" ? (
						<span className="font-semibold text-white bg-red px-2.5 py-1 rounded-3xl">
							{status}
						</span>
					) : (
						<span className="font-semibold text-white bg-green px-2.5 py-1 rounded-3xl">
							{status}
						</span>
					)}
				</div>
				{isManager && (
					<button
						type="button"
						className="flex items-center gap-1 bg-main rounded-full px-2.5 py-1 text-white font-semibold"
						onClick={() => {
							navigate(`/volunteer/${id}/edit`);
						}}
					>
						수정
						<MdEditNote />
					</button>
				)}
			</div>
			<span className="text-grayText font-medium">{date}</span>
			<span className="inline-flex gap-1 items-center">
				<VscLocation className="size-5 text-blueGray" />
				<span className="text-blueGray font-medium">{location}</span>
				<span className="text-blueGray font-medium">{addressName}</span>
			</span>
			<span className="text-grayText font-medium">{time}</span>
			<span className="text-grayText font-medium">{pets}</span>
		</div>
	);
}

import { fetchAddressBooks } from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import useManagerStore from "@/lib/store/managerStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CenterListItemProps {
	centerId: string;
	centerName: string;
	status: string;
	index: number;
}

interface AddressBook {
	id: number;
	addressName: string;
	address: string;
}

export default function CenterListItem({
	centerId,
	centerName,
	status,
	index,
}: CenterListItemProps) {
	const { setSelectedCenter, setIsCenterMember } = useCenterStore();
	const { setAddressBook } = useManagerStore();
	const navigate = useNavigate();

	const { refetch } = useQuery<AddressBook[], Error>({
		queryKey: ["addressBooks", centerId],
		queryFn: () => fetchAddressBooks(centerId),
		enabled: false,
	});

	const handleRegister = () => {
		console.log("Register clicked for center:", centerId);
	};

	const handleVisit = async () => {
		setSelectedCenter({
			centerId,
			centerName,
			status,
		});

		const { data } = await refetch();

		if (data) {
			setAddressBook(data);
			console.log("Address book data:", data);
		}

		if (status === "MANAGER" || status === "USER") {
			setIsCenterMember(true);
		} else {
			setIsCenterMember(false);
		}

		if (status === "MANAGER") {
			navigate("/manager");
		} else {
			navigate("/");
		}
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
					<button
						type="button"
						className="bg-blueGray rounded-full text-white px-4 py-1 text-sm font-semibold"
						onClick={handleVisit}
					>
						방문하기
					</button>
				</span>
			</span>
		</div>
	);
}

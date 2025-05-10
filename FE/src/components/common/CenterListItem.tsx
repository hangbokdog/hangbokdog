import {
	cancelJoinRequestAPI,
	fetchAddressBooks,
	registerCenterAPI,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import useManagerStore from "@/lib/store/managerStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CenterListItemProps {
	centerId: string;
	centerName: string;
	status: string;
	index: number;
	query?: string;
	centerJoinRequestId?: string;
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
	query,
	centerJoinRequestId,
}: CenterListItemProps) {
	const { setSelectedCenter, setIsCenterMember } = useCenterStore();
	const { setAddressBook } = useManagerStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { refetch } = useQuery<AddressBook[], Error>({
		queryKey: ["addressBooks", centerId],
		queryFn: () => fetchAddressBooks(centerId),
		enabled: false,
	});

	const { mutate: registerCenter } = useMutation({
		mutationFn: () => registerCenterAPI(centerId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerSearch", query],
			});
			toast.success("가입 신청이 완료되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청에 실패했습니다.");
		},
	});

	const { mutate: cancelJoinRequest } = useMutation({
		mutationFn: () => cancelJoinRequestAPI(centerJoinRequestId as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerSearch", query],
			});
			toast.success("가입 신청이 취소되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청 취소에 실패했습니다.");
		},
	});

	const handleRegister = () => {
		registerCenter();
	};

	const handleCancel = () => {
		cancelJoinRequest();
	};

	const handleVisit = async () => {
		setSelectedCenter({
			centerId,
			centerName,
			status,
			centerJoinRequestId,
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
				{status === "NONE" && (
					<button
						type="button"
						className="bg-male rounded-full text-white px-4 py-1 text-sm font-semibold"
						onClick={handleRegister}
					>
						가입 신청
					</button>
				)}
				{status === "APPLIED" && (
					<button
						type="button"
						className="bg-red rounded-full text-white px-4 py-1 text-sm font-semibold"
						onClick={handleCancel}
					>
						신청 취소
					</button>
				)}
				<button
					type="button"
					className="bg-blueGray rounded-full text-white px-4 py-1 text-sm font-semibold"
					onClick={handleVisit}
				>
					방문하기
				</button>
			</span>
		</div>
	);
}

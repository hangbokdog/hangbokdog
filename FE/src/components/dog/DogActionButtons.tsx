import { applySponsorAPI } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface DogActionButtonsProps {
	sponsorLink: string;
	adoptionLink: string;
}

export default function DogActionButtons({
	sponsorLink,
	adoptionLink,
}: DogActionButtonsProps) {
	const { isCenterMember } = useCenterStore();
	const navigate = useNavigate();
	const { id: dogId } = useParams();
	const centerId = useCenterStore.getState().selectedCenter?.centerId;

	const { mutate: applySponsor } = useMutation({
		mutationKey: ["applySponsor", dogId, centerId],
		mutationFn: () => applySponsorAPI(dogId as string, centerId as string),
		onSuccess: () => {
			toast.success("결연 신청이 완료되었습니다.");
			window.open(sponsorLink, "_blank", "noopener,noreferrer");
		},
		onError: () => {
			toast.error("결연 신청에 실패했습니다.");
		},
	});

	const handleSponsorClick = () => {
		if (isCenterMember) {
			applySponsor();
		} else {
			toast.error("센터 가입 후 이용해주세요.");
		}
	};

	const handleAdoptionClick = () => {
		if (isCenterMember) {
			navigate(adoptionLink);
		} else {
			toast.error("센터 가입 후 이용해주세요.");
		}
	};
	return (
		<div className="flex items-center justify-center gap-2">
			{/* <button
				type="button"
				className="bg-main text-white rounded-full px-4 py-2 font-bold cursor-pointer"
				onClick={handleSponsorClick}
			>
				결연 신청
			</button> */}

			<button
				type="button"
				className="bg-green text-white rounded-full px-4 py-2 font-bold cursor-pointer"
				onClick={handleAdoptionClick}
			>
				임보 및 입양
			</button>
		</div>
	);
}

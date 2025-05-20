import { applyAdoptionAPI } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface AdoptionButtonProps {
	isChecked: boolean;
}

export default function AdoptionButton({ isChecked }: AdoptionButtonProps) {
	const { id: dogId } = useParams();
	const { isCenterMember } = useCenterStore();
	const navigate = useNavigate();
	const { mutate: applyAdoption } = useMutation({
		mutationKey: ["applyAdoption", dogId],
		mutationFn: () => applyAdoptionAPI(dogId as string),
		onSuccess: () => {
			toast.success("입양 신청이 완료되었습니다.");

			window.open(
				"https://docs.google.com/forms/d/e/1FAIpQLSdprLTSbQHm8nZulb266VOza-yxB0pqDmiLaR32e1B46rR4aw/viewform",
				"_blank",
				"noopener,noreferrer",
			);
			navigate(-1);
		},
		onError: () => {
			toast.error("입양 신청에 실패했습니다.");
		},
	});
	const handleApplyAdoption = () => {
		if (isCenterMember) {
			applyAdoption();
		} else {
			toast.error("센터 가입 후 이용해주세요.");
		}
	};
	return (
		<button
			type="button"
			className={`w-full py-3 rounded-lg mb-2.5 text-white ${
				isChecked ? "bg-green" : "bg-gray-300"
			}`}
			disabled={!isChecked}
			onClick={handleApplyAdoption}
		>
			입양 신청하기
		</button>
	);
}

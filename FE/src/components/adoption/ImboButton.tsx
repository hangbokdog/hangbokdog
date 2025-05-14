import { applyFosterAPI } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface ImboButtonProps {
	isChecked: boolean;
}

export default function ImboButton({ isChecked }: ImboButtonProps) {
	const { id: dogId } = useParams();
	const { isCenterMember } = useCenterStore();
	const centerId = useCenterStore.getState().selectedCenter?.centerId;
	const navigate = useNavigate();

	const { mutate: applyFoster } = useMutation({
		mutationKey: ["applyFoster", dogId],
		mutationFn: () => applyFosterAPI(dogId as string, centerId as string),
		onSuccess: () => {
			toast.success("임시 보호 신청이 완료되었습니다.");

			window.open(
				"https://docs.google.com/forms/d/e/1FAIpQLSdprLTSbQHm8nZulb266VOza-yxB0pqDmiLaR32e1B46rR4aw/viewform",
				"_blank",
				"noopener,noreferrer",
			);
			navigate(`/dogs/${dogId}`);
		},
		onError: () => {
			toast.error("임시 보호 신청에 실패했습니다.");
		},
	});
	const handleApplyAdoption = () => {
		if (isCenterMember) {
			applyFoster();
		} else {
			toast.error("센터 가입 후 이용해주세요.");
		}
	};
	return (
		<button
			type="button"
			className={`w-full py-3 rounded-lg mb-2.5 text-white ${
				isChecked ? "bg-[#BC2DCC]" : "bg-gray-300"
			}`}
			disabled={!isChecked}
			onClick={handleApplyAdoption}
		>
			임시 보호 신청하기
		</button>
	);
}

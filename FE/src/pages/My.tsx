import MileageCard from "@/components/my/MileageCard";
import Profile from "@/components/my/Profile";
import Order from "@/components/my/Order";
import ProtectDogPanel from "@/components/my/ProtectDogPanel";
import { logoutAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function handleEdit() {
	//프로필 수정 로직
}

export default function My() {
	const { clearAuth } = useAuthStore();
	const navigate = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: logoutAPI,
		onSuccess: () => {
			clearAuth();
			toast.success("로그아웃되었습니다.");
			navigate("/");
		},
		onError: () => {
			toast.error("로그아웃에 실패했습니다.");
			clearAuth();
			navigate("/");
		},
	});

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<div className="flex flex-col">
			<Profile
				name="멜롱"
				email="min@naver.com"
				onEdit={() => {
					handleEdit();
					console.log("프로필 수정 클릭됨");
				}}
			/>
			<div className="grid grid-cols-2 justify-center gap-3 mx-2.5">
				<div className="h-[165px]">
					<MileageCard />
				</div>
				<div className="h-[165px]">
					<MileageCard />
				</div>
			</div>
			<div>
				<Order />
			</div>
			<div>
				<ProtectDogPanel />
			</div>
			<button
				type="button"
				onClick={handleLogout}
				className="flex items-center justify-center gap-2 m-2.5 p-4 bg-superLightGray rounded-lg text-grayText hover:bg-red hover:text-white transition-all duration-300 "
				title="로그아웃"
			>
				<MdLogout className="size-5" />
				<span className="text-sm font-medium">로그아웃</span>
			</button>
		</div>
	);
}

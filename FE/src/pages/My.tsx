import MileageCard from "@/components/my/MileageCard";
import MemberStatisticsCard from "@/components/my/MemberStatisticsCard";
import Profile from "@/components/my/Profile";
import MyActivitiesPanel from "@/components/my/MyActivitiesPanel";
import { logoutAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { MdLogout } from "react-icons/md";
import { BuildingIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function handleEdit() {
	//프로필 수정 로직
}

export default function My() {
	const { clearAuth } = useAuthStore();
	const { selectedCenter, clearSelectedCenter } = useCenterStore();
	const navigate = useNavigate();

	const logoutMutation = useMutation({
		mutationFn: logoutAPI,
		onSuccess: () => {
			clearAuth();
			clearSelectedCenter();
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

	const handleCenterChange = () => {
		clearSelectedCenter();
		toast.success("센터를 변경하였습니다.");
		navigate("/");
	};

	return (
		<div className="flex flex-col gap-4 mt-2.5">
			<Profile onEdit={handleEdit} />

			{selectedCenter && (
				<div className="mx-2.5 mb-2 flex flex-col gap-4">
					<div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-custom-xs">
						<div className="flex items-center">
							<BuildingIcon className="w-4 h-4 text-gray-500 mr-2" />
							<div>
								<p className="text-xs text-gray-500">내 센터</p>
								<p className="text-sm font-medium">
									{selectedCenter.centerName}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={handleCenterChange}
							className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-main hover:bg-main hover:text-white transition-all duration-200"
						>
							변경하기
						</button>
					</div>
					<button
						type="button"
						onClick={handleLogout}
						className="flex w-full items-center justify-center gap-2 p-4 bg-superLightGray rounded-lg text-grayText hover:bg-red hover:text-white transition-all duration-300 "
						title="로그아웃"
					>
						<MdLogout className="size-5" />
						<span className="text-sm font-medium">로그아웃</span>
					</button>
				</div>
			)}
			<div>
				<MyActivitiesPanel />
			</div>
		</div>
	);
}

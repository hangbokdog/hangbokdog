import MileageCard from "@/components/my/MileageCard";
import Profile from "@/components/my/Profile";
import Order from "@/components/my/Order";
import { logoutAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { MdLogout } from "react-icons/md";
import { BuildingIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DogTabsPanel from "@/components/my/DogTabsPanel";
import MyOngoingVolunteer from "@/components/my/MyOngoingVolunteer";

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
		<div className="flex flex-col mt-2.5">
			<Profile onEdit={handleEdit} />

			{selectedCenter && (
				<div className="mx-2.5 mb-3">
					<div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
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
				</div>
			)}
			<div>
				<MyOngoingVolunteer />
			</div>
			{/* <div className="grid grid-cols-2 justify-center gap-3 mx-2.5">
				<div className="h-[165px]">
					<MileageCard />
				</div>
				<div className="h-[165px]">
					<MileageCard />
				</div>
			</div>
			<div>
				<Order />
			</div> */}
			<div>
				<DogTabsPanel />
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

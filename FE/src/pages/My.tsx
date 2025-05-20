import Profile from "@/components/my/Profile";
import MyActivitiesPanel from "@/components/my/MyActivitiesPanel";
import { getUserInfoAPI, logoutAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdLogout } from "react-icons/md";
import { BuildingIcon } from "lucide-react";
import { Bell, BellOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { UserInfoResponse } from "@/types/auth";
import { deleteFCMToken, registerFCMToken } from "@/api/notification";
import { requestFCMToken } from "@/config/firebase";

export default function My() {
	const { user, setUserInfo, clearAuth } = useAuthStore();
	const { selectedCenter, clearSelectedCenter, isCenterMember } =
		useCenterStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<UserInfoResponse>({
		queryKey: ["userInfo"],
		queryFn: getUserInfoAPI,
	});

	const [notificationsEnabled, setNotificationsEnabled] = useState(false);

	useEffect(() => {
		if (data) {
			setNotificationsEnabled(data.notification || false);

			if (
				data.memberId &&
				data.nickName &&
				data.profileImage !== undefined
			) {
				setUserInfo(
					data.memberId,
					data.nickName || "",
					data.profileImage || "",
					// data.notification || false,
				);
			}
		}
	}, [data, setUserInfo]);

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

	const { mutate: deleteFCMTokenMutation } = useMutation({
		mutationFn: deleteFCMToken,
		onSuccess: () => {
			toast.success("알림을 비활성화하였습니다.");
			setNotificationsEnabled(false);

			if (data?.memberId && data.nickName) {
				setUserInfo(
					data.memberId,
					data.nickName,
					data.profileImage || "",
					// false,
				);
			}
			queryClient.invalidateQueries({ queryKey: ["userInfo"] });
		},
		onError: () => {
			toast.error("알림을 비활성화하는데 실패했습니다.");
		},
	});

	const { mutate: registerFCMTokenMutation, isPending: isActivating } =
		useMutation({
			mutationFn: async () => {
				try {
					const token = await requestFCMToken();
					if (!token) {
						throw new Error("FCM 토큰을 받아올 수 없습니다.");
					}

					return await registerFCMToken(
						token,
						selectedCenter?.centerId,
					);
				} catch (error) {
					console.error("FCM 토큰 등록 실패:", error);
					throw error;
				}
			},
			onSuccess: () => {
				toast.success("알림을 활성화하였습니다.");
				setNotificationsEnabled(true);

				if (data?.memberId && data.nickName) {
					setUserInfo(
						data.memberId,
						data.nickName,
						data.profileImage || "",
						// true,
					);
				}
				queryClient.invalidateQueries({ queryKey: ["userInfo"] });
			},
			onError: (error) => {
				console.error("알림 활성화 실패:", error);
				toast.error(
					"알림을 활성화하는데 실패했습니다. 브라우저 알림 권한을 확인해주세요.",
				);
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

	const toggleNotifications = () => {
		if (notificationsEnabled) {
			deleteFCMTokenMutation();
		} else {
			registerFCMTokenMutation();
		}
	};

	if (isLoading) return <div className="p-4">불러오는 중...</div>;
	if (error || !data)
		return <div className="p-4">사용자 정보를 불러올 수 없습니다.</div>;

	return (
		<div className="flex flex-col gap-4 mt-2.5">
			<Profile data={data} />

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

					<div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-custom-xs">
						<div className="flex items-center">
							{notificationsEnabled ? (
								<Bell className="w-4 h-4 text-gray-500 mr-2" />
							) : (
								<BellOff className="w-4 h-4 text-gray-500 mr-2" />
							)}
							<div>
								<p className="text-xs text-gray-500">
									알림 설정
								</p>
								<p className="text-sm font-medium">
									{notificationsEnabled
										? "활성화"
										: "비활성화"}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={toggleNotifications}
							className={`flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ${
								notificationsEnabled ? "bg-main" : "bg-gray-300"
							}`}
							aria-label={
								notificationsEnabled ? "알림 끄기" : "알림 켜기"
							}
							disabled={isLoading || isActivating}
						>
							{isActivating ? (
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								<div
									className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
										notificationsEnabled
											? "translate-x-3"
											: "-translate-x-3"
									}`}
								/>
							)}
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
			{isCenterMember ? (
				<MyActivitiesPanel />
			) : (
				<div className="p-4 bg-red-50 text-center rounded-lg shadow-custom-xs mx-2.5">
					센터 가입 후 활동 내역을 확인할 수 있습니다.
				</div>
			)}
		</div>
	);
}

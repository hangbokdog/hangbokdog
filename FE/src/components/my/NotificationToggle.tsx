import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";
import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";
import useNotificationStore from "@/lib/store/notificationStore";
import { requestFCMToken } from "@/config/firebase";
import { registerFCMToken, deleteFCMToken } from "@/api/notification";

export default function NotificationToggle() {
	const { selectedCenter } = useCenterStore();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true); // 기본값 true

	// 초기에 알림 상태 확인 후 세팅 (선택적: 서버에서 등록 여부 확인 가능)
	useEffect(() => {
		const saved = localStorage.getItem("notifications_enabled");
		if (saved === "false") {
			setNotificationsEnabled(false);
		}
	}, []);

	const toggleNotifications = async () => {
		const nextState = !notificationsEnabled;

		try {
			if (nextState) {
				// 🔔 알림 ON: 토큰 요청 및 서버 등록
				const token = await requestFCMToken();
				if (token && selectedCenter?.centerId) {
					await registerFCMToken(token, selectedCenter.centerId);
					toast.success("알림이 활성화되었습니다.");
					localStorage.setItem("notifications_enabled", "true");
					setNotificationsEnabled(true);
				}
			} else {
				// 🔕 알림 OFF: 서버에서 토큰 삭제
				const token = await requestFCMToken(); // 기존 토큰 가져오기
				if (token) {
					await deleteFCMToken(token);
				}
				toast.success("알림이 비활성화되었습니다.");
				localStorage.setItem("notifications_enabled", "false");
				setNotificationsEnabled(false);
			}
		} catch (error) {
			toast.error("알림 설정 변경 중 오류가 발생했습니다.");
			console.error("알림 토글 실패:", error);
		}
	};

	return (
		<div>
			<div className="mb-2 flex flex-col gap-4">
				<div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-custom-xs">
					<div className="flex items-center">
						<Bell className="w-4 h-4 text-gray-500 mr-2" />
						<div>
							<p className="text-xs text-gray-500">내 알림</p>
							<p className="text-sm font-medium">
								{selectedCenter?.centerName || "센터 없음"}
							</p>
						</div>
					</div>

					{/* 벨 아이콘 토글 버튼 */}
					<button
						type="button"
						onClick={toggleNotifications}
						className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-main hover:text-white transition-all duration-200"
						aria-label={
							notificationsEnabled ? "알림 끄기" : "알림 켜기"
						}
					>
						{notificationsEnabled ? (
							<Bell className="w-5 h-5" />
						) : (
							<BellOff className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

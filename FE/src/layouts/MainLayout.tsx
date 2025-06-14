import ScrollToTop from "@/components/common/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { useNotification } from "@/lib/hooks/useNotification";
import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { onForegroundMessage } from "@/config/firebase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function MainLayout() {
	// 최상위 레이아웃에서 알림 훅 사용
	const { checkNotificationPermission, setupFCM } = useNotification();
	const { user } = useAuthStore();
	const { selectedCenter, setSelectedCenter, setIsCenterMember } =
		useCenterStore();
	const queryClient = useQueryClient();

	// 앱 로드 시 알림 시스템 초기화
	useEffect(() => {
		// 로그인 상태와 센터 선택 확인
		if (user.accessToken && selectedCenter?.centerId) {
			// 알림 설정이 비활성화되어 있으면 FCM 토큰 설정 건너뛰기
			// if (user.notification === false) {
			// 	console.log(
			// 		"알림이 비활성화되어 있어 FCM 토큰을 설정하지 않습니다.",
			// 	);
			// 	return;
			// }

			// 알림 권한 확인 후 FCM 토큰 초기화
			checkNotificationPermission().then((permission) => {
				if (permission === "granted") {
					// 권한이 있으면 FCM 토큰 초기화 및 등록
					setupFCM().catch((error: unknown) => {
						console.error("MainLayout FCM 초기화 오류:", error);
					});
				}
			});
		}
	}, [
		checkNotificationPermission,
		setupFCM,
		user.accessToken,
		// user.notification,
		selectedCenter?.centerId,
	]);

	return (
		<div className="w-screen min-h-screen-safe h-auto flex justify-center">
			<ScrollToTop />
			<div className="flex flex-col w-full max-w-[440px] bg-background shadow-custom-xs">
				<Outlet />
			</div>
			<Toaster richColors={true} />
		</div>
	);
}

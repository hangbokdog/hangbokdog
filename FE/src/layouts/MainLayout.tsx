import ScrollToTop from "@/components/common/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { useNotification } from "@/lib/hooks/useNotification";
import { useEffect } from "react";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { onForegroundMessage } from "@/config/firebase";
import useNotificationStore, {
	type Notification,
} from "@/lib/store/notificationStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function MainLayout() {
	// 최상위 레이아웃에서 알림 훅 사용
	const { checkNotificationPermission, setupFCM } = useNotification();
	const { user } = useAuthStore();
	const { selectedCenter, setSelectedCenter, setIsCenterMember } =
		useCenterStore();
	const { addNotification } = useNotificationStore();
	const queryClient = useQueryClient();

	// 앱 로드 시 알림 시스템 초기화
	useEffect(() => {
		// 로그인 상태와 센터 선택 확인
		if (user.accessToken && selectedCenter?.centerId) {
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
		selectedCenter?.centerId,
	]);

	// FCM 포그라운드 메시지 리스너 설정
	useEffect(() => {
		if (!user.accessToken || !selectedCenter?.centerId) return;

		// 포그라운드 메시지 리스너
		let unsubscribe = () => {};
		try {
			unsubscribe = onForegroundMessage((payload) => {
				if (payload.notification) {
					// 알림 정보 추출
					const title = payload.notification.title || "알림";
					const body = payload.notification.body || "";

					try {
						// body를 JSON으로 파싱 시도
						const parsedBody = JSON.parse(body);
						const notificationType = parsedBody.type;
						const content = parsedBody.content || "";
						const createdAt =
							parsedBody.createdAt || new Date().toISOString();

						// 알림 타입에 따라 처리
						switch (notificationType) {
							case "CENTER": {
								// 센터 가입 승인/거절 알림 처리
								const isApproved = parsedBody.isApproved;

								// 스토어에 알림 추가
								const newNotification: Notification = {
									id: Date.now().toString(),
									title,
									body: content,
									data: {
										...parsedBody,
										centerId: selectedCenter.centerId,
										centerName: selectedCenter.centerName,
									},
									isRead: false,
									createdAt,
									type: "CENTER",
								};

								addNotification(newNotification);

								// 토스트 알림 표시
								if (isApproved) {
									setIsCenterMember(true);
									setSelectedCenter({
										centerId: selectedCenter.centerId,
										centerName: selectedCenter.centerName,
										status: "USER",
									});
									toast.success(
										`${title}에 가입이 승인되었습니다`,
										{
											duration: 5000,
										},
									);

									// 쿼리 무효화
									queryClient.invalidateQueries({
										queryKey: ["myCenters"],
									});
									queryClient.invalidateQueries({
										queryKey: ["myJoinRequestCenters"],
									});
								} else {
									setIsCenterMember(false);
									setSelectedCenter({
										centerId: selectedCenter.centerId,
										centerName: selectedCenter.centerName,
										status: "NONE",
									});
									toast.error(
										`${title} 가입 신청이 거절되었습니다`,
										{
											duration: 5000,
										},
									);

									// 쿼리 무효화
									queryClient.invalidateQueries({
										queryKey: ["myJoinRequestCenters"],
									});
								}
								break;
							}

							case "EMERGENCY": {
								// 응급 알림 처리
								const centerName =
									parsedBody.centerName || title;

								// 스토어에 알림 추가
								const newNotification: Notification = {
									id: Date.now().toString(),
									title,
									body: content,
									data: {
										...parsedBody,
										emergencyId: parsedBody.emergencyId,
										centerName,
									},
									isRead: false,
									createdAt,
									type: "EMERGENCY",
								};

								addNotification(newNotification);

								// 긴급 알림은 경고 토스트로 표시
								toast.error(`${title}: ${content}`, {
									description: `센터: ${centerName}`,
									duration: 8000,
								});
								break;
							}

							case "VOLUNTEER": {
								// 봉사활동 신청 승인/거절 알림 처리
								const volunteerEventId =
									parsedBody.volunteerEventId;

								// 스토어에 알림 추가
								const newNotification: Notification = {
									id: Date.now().toString(),
									title,
									body: content,
									data: {
										...parsedBody,
										volunteerEventId,
									},
									isRead: false,
									createdAt,
									type: "VOLUNTEER",
								};

								addNotification(newNotification);

								// 토스트 알림 표시
								if (content.includes("승인")) {
									toast.success(`${title}: ${content}`, {
										duration: 5000,
									});
								} else {
									toast.error(`${title}: ${content}`, {
										duration: 5000,
									});
								}

								// 봉사 관련 쿼리 무효화
								queryClient.invalidateQueries({
									queryKey: ["volunteerEvents"],
								});
								break;
							}

							default: {
								// 기타 알림 처리
								// 스토어에 알림 추가
								const newNotification: Notification = {
									id: Date.now().toString(),
									title,
									body: content || body,
									data: parsedBody,
									isRead: false,
									createdAt,
									type: "SYSTEM",
								};

								addNotification(newNotification);

								// 일반 토스트 알림 표시
								toast.info(title, {
									description: content || body,
									duration: 5000,
								});
							}
						}
					} catch (parseError) {
						// JSON 파싱 실패 시 이전 방식으로 처리
						console.warn("알림 메시지 파싱 실패:", parseError);

						// 가입 신청 관련 알림 처리
						if (title && (body === "true" || body === "false")) {
							const isApproved = body === "true";
							const centerName = title;

							// 토스트 알림 표시
							if (isApproved) {
								setIsCenterMember(true);
								setSelectedCenter({
									centerId: selectedCenter.centerId,
									centerName: selectedCenter.centerName,
									status: "USER",
								});
								toast.success(
									`${centerName}에 가입이 승인되었습니다`,
									{
										duration: 5000,
									},
								);

								// 쿼리 무효화
								queryClient.invalidateQueries({
									queryKey: ["myCenters"],
								});
								queryClient.invalidateQueries({
									queryKey: ["myJoinRequestCenters"],
								});
							} else {
								setIsCenterMember(false);
								setSelectedCenter({
									centerId: selectedCenter.centerId,
									centerName: selectedCenter.centerName,
									status: "NONE",
								});
								toast.error(
									`${centerName} 가입 신청이 거절되었습니다`,
									{
										duration: 5000,
									},
								);

								// 쿼리 무효화
								queryClient.invalidateQueries({
									queryKey: ["myJoinRequestCenters"],
								});
							}

							// 스토어에 알림 추가
							const newNotification: Notification = {
								id: Date.now().toString(),
								title: centerName,
								body: isApproved
									? "센터 가입이 승인되었습니다"
									: "센터 가입 신청이 거절되었습니다",
								data: {
									type: "CENTER_JOIN_REQUEST",
									isApproved: body,
									centerId: selectedCenter.centerId,
									centerName: selectedCenter.centerName,
								},
								isRead: false,
								createdAt: new Date().toISOString(),
								type: "CENTER_JOIN_REQUEST",
							};

							addNotification(newNotification);
						} else {
							// 일반 알림 처리
							toast.info(title, {
								description: body,
								duration: 5000,
							});

							// 스토어에 알림 추가
							const newNotification: Notification = {
								id: Date.now().toString(),
								title,
								body,
								isRead: false,
								createdAt: new Date().toISOString(),
								type: "SYSTEM",
							};

							addNotification(newNotification);
						}
					}
				}
			});
		} catch (error) {
			console.error("FCM 메시지 리스너 설정 중 오류 발생:", error);
		}

		return () => {
			try {
				unsubscribe();
			} catch (error) {
				console.error("FCM 리스너 해제 중 오류 발생:", error);
			}
		};
	}, [
		user.accessToken,
		selectedCenter?.centerId,
		selectedCenter?.centerName,
		addNotification,
		queryClient,
		setIsCenterMember,
		setSelectedCenter,
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

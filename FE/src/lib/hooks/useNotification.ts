import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchNotifications,
	getUnreadNotificationsCount,
	markNotificationAsRead,
	registerFCMToken,
} from "@/api/notification";
import { requestFCMToken, onForegroundMessage } from "@/config/firebase";
import useNotificationStore, {
	type Notification,
} from "@/lib/store/notificationStore";
import useCenterStore from "@/lib/store/centerStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NotificationResponse {
	notifications: Notification[];
	totalCount: number;
}

export const useNotification = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { selectedCenter } = useCenterStore();
	const {
		notifications,
		setNotifications,
		unreadCount,
		setUnreadCount,
		markAsRead,
		addNotification,
		isNotificationOpen,
		toggleNotificationPanel,
		closeNotificationPanel,
	} = useNotificationStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// FCM 토큰 요청 및 등록
	const setupFCM = useCallback(async () => {
		if (!selectedCenter?.centerId) return;

		try {
			setIsLoading(true);

			let token = null;

			try {
				token = await requestFCMToken().catch((err) => {
					console.warn(
						"FCM 토큰 요청 실패. 알림 기능이 제한될 수 있습니다:",
						err,
					);
					return null;
				});
			} catch (tokenError) {
				console.warn(
					"FCM 토큰 요청 시 예외 발생. 알림 기능이 제한될 수 있습니다:",
					tokenError,
				);
			}

			// 개발 환경인 경우 테스트용 토큰 생성
			if (!token && process.env.NODE_ENV === "development") {
				token = `dev-fcm-token-${Date.now()}`;
				console.log("개발 환경 테스트용 FCM 토큰 생성:", token);
			}

			if (token) {
				try {
					await registerFCMToken(token, selectedCenter.centerId);
					console.log("FCM 토큰 등록 성공");
				} catch (registerError) {
					console.error("FCM 토큰 서버 등록 실패:", registerError);
					// 실패해도 기본 기능은 계속 작동하도록 함
				}
			}
		} catch (error) {
			console.error("FCM 설정 오류:", error);
			// 에러가 발생해도 앱 자체의 기능은 계속 작동하도록 함
		} finally {
			setIsLoading(false);
		}
	}, [selectedCenter?.centerId]);

	// 알림 목록 조회
	// const { refetch: refetchNotifications } = useQuery<NotificationResponse>({
	// 	queryKey: ["notifications", selectedCenter?.centerId],
	// 	queryFn: () =>
	// 		selectedCenter?.centerId
	// 			? fetchNotifications(selectedCenter.centerId)
	// 			: Promise.resolve({ notifications: [], totalCount: 0 }),
	// 	enabled: !!selectedCenter?.centerId,
	// });

	// 알림 데이터 설정
	// useEffect(() => {
	// 	if (refetchNotifications) {
	// 		refetchNotifications().then((result) => {
	// 			if (result.data) {
	// 				setNotifications(result.data.notifications || []);
	// 			}
	// 		});
	// 	}
	// }, [refetchNotifications, setNotifications]);

	// 읽지 않은 알림 개수 조회
	// const { refetch: refetchUnreadCount } = useQuery<number>({
	// 	queryKey: ["unreadNotificationsCount", selectedCenter?.centerId],
	// 	queryFn: () =>
	// 		selectedCenter?.centerId
	// 			? getUnreadNotificationsCount(selectedCenter.centerId)
	// 			: Promise.resolve(0),
	// 	enabled: !!selectedCenter?.centerId,
	// });

	// 알림 개수 업데이트
	// useEffect(() => {
	// 	if (refetchUnreadCount) {
	// 		refetchUnreadCount().then((result) => {
	// 			if (result.data !== undefined) {
	// 				setUnreadCount(result.data);
	// 			}
	// 		});
	// 	}
	// }, [refetchUnreadCount, setUnreadCount]);

	// 알림 읽음 처리 뮤테이션
	const { mutate: readNotification } = useMutation({
		mutationFn: markNotificationAsRead,
		onSuccess: (data, notificationId) => {
			markAsRead(notificationId);
			queryClient.invalidateQueries({
				queryKey: ["unreadNotificationsCount"],
			});
		},
	});

	// 알림 클릭 핸들러
	const handleNotificationClick = useCallback(
		(notification: Notification) => {
			// 읽음 처리
			if (!notification.isRead) {
				readNotification(notification.id);
			}

			// 알림 타입에 따른 처리
			if (
				notification.type === "VOLUNTEER_APPLICATION" &&
				notification.data?.volunteerId
			) {
				navigate(
					`/manager/volunteer/applications?id=${notification.data.volunteerId}`,
				);
			}

			// 알림 패널 닫기
			closeNotificationPanel();
		},
		[readNotification, navigate, closeNotificationPanel],
	);

	// FCM 포그라운드 알림 리스너 설정
	useEffect(() => {
		if (!selectedCenter?.centerId) return;

		// FCM 설정
		setupFCM().catch((err) => {
			console.error("FCM 설정 중 오류 발생:", err);
			// 오류가 발생해도 앱은 계속 작동
		});

		// 포그라운드 메시지 리스너
		let unsubscribe = () => {};
		try {
			unsubscribe = onForegroundMessage((payload) => {
				console.log("FCM 메시지 수신:", payload);

				if (payload.notification) {
					// 토스트 알림 표시
					toast.info(payload.notification.title, {
						description: payload.notification.body,
						duration: 5000,
						action: {
							label: "확인",
							onClick: () => console.log("알림 확인"),
						},
					});

					// 스토어에 알림 추가
					const notificationType =
						(payload.data?.type as
							| "VOLUNTEER_APPLICATION"
							| "SYSTEM"
							| "INFO") || "SYSTEM";

					const newNotification: Notification = {
						id: Date.now().toString(), // 실제로는 서버에서 ID 제공
						title: payload.notification.title || "",
						body: payload.notification.body || "",
						data: payload.data,
						isRead: false,
						createdAt: new Date().toISOString(),
						type: notificationType,
					};

					addNotification(newNotification);
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
	}, [selectedCenter?.centerId, setupFCM, addNotification]);

	return {
		notifications,
		unreadCount,
		isLoading,
		isNotificationOpen,
		toggleNotificationPanel,
		closeNotificationPanel,
		handleNotificationClick,
		// refetchNotifications,
		// refetchUnreadCount,
	};
};

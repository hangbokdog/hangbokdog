import { useEffect, useState, useCallback } from "react";
import React from "react";
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

// 알림 타입 확장 (기존 코드는 그대로 두고 새 타입만 추가)
// type NotificationType = "VOLUNTEER_APPLICATION" | "SYSTEM" | "INFO" | "CENTER_JOIN_REQUEST";

interface NotificationResponse {
	notifications: Notification[];
	totalCount: number;
}

// 알림 권한 상태 타입 정의
export type NotificationPermissionStatus =
	| "granted"
	| "denied"
	| "default"
	| "unsupported";

export const useNotification = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [permissionStatus, setPermissionStatus] =
		useState<NotificationPermissionStatus>("default");
	const { selectedCenter, setSelectedCenter, setIsCenterMember } =
		useCenterStore();
	const {
		notifications,
		setNotifications,
		unreadCount,
		setUnreadCount,
		markAsRead,
		addNotification,
		removeNotification,
		clearAllNotifications,
		isNotificationOpen,
		toggleNotificationPanel,
		closeNotificationPanel,
	} = useNotificationStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// 알림 권한 상태 확인 함수
	const checkNotificationPermission = useCallback(async () => {
		// 브라우저가 알림을 지원하는지 확인
		if (!("Notification" in window)) {
			setPermissionStatus("unsupported");
			return "unsupported";
		}

		// 현재 권한 상태 확인
		const permission = Notification.permission;
		setPermissionStatus(permission as NotificationPermissionStatus);
		return permission;
	}, []);

	// FCM 토큰 요청 및 등록
	const setupFCM = useCallback(async () => {
		if (!selectedCenter?.centerId) return;

		try {
			setIsLoading(true);

			// 권한 상태 확인
			const permissionStatus = await checkNotificationPermission();

			// 권한이 거부된 경우 더 이상 진행하지 않음
			if (permissionStatus === "denied") {
				return;
			}

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
				// console.log("개발 환경 테스트용 FCM 토큰 생성:", token);
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
	}, [selectedCenter?.centerId, checkNotificationPermission]);

	// 알림 권한 요청 함수
	const requestNotificationPermission = useCallback(async () => {
		// 브라우저가 알림을 지원하는지 확인
		if (!("Notification" in window)) {
			setPermissionStatus("unsupported");
			return "unsupported";
		}

		// 이미 권한이 부여된 경우
		if (Notification.permission === "granted") {
			setPermissionStatus("granted");
			return "granted";
		}

		// 이미 권한이 거부된 경우
		if (Notification.permission === "denied") {
			setPermissionStatus("denied");
			return "denied";
		}

		try {
			// 권한 요청
			const permission = await Notification.requestPermission();
			setPermissionStatus(permission as NotificationPermissionStatus);

			// 권한이 허용된 경우 FCM 설정 실행
			if (permission === "granted" && selectedCenter?.centerId) {
				// FCM 토큰 설정 및 등록
				setupFCM().catch((err) => {
					console.error("권한 허용 후 FCM 설정 중 오류 발생:", err);
				});
			}

			// 권한 요청 결과 로컬 스토리지에 저장
			localStorage.setItem("notification_permission_requested", "true");

			return permission;
		} catch (error) {
			console.error("알림 권한 요청 중 오류 발생:", error);
			return "error";
		}
	}, [selectedCenter?.centerId, setupFCM]);

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
			// 알림 삭제 처리 (읽음 처리 대신)
			removeNotification(notification.id);

			// 알림 패널 닫기
			closeNotificationPanel();

			// 알림 타입에 따른 처리
			if (
				notification.type === "VOLUNTEER_APPLICATION" &&
				notification.data?.volunteerId
			) {
				navigate(
					`/manager/volunteer/applications?id=${notification.data.volunteerId}`,
				);
			} else if (notification.type === "CENTER_JOIN_REQUEST") {
				// 센터 가입 요청 알림일 경우
				const isApproved = notification.data?.isApproved === "true";

				if (isApproved) {
					// 승인된 경우
					setIsCenterMember(true);

					// 센터 상태 업데이트 (센터 정보가 있으면 해당 센터로, 없으면 현재 선택된 센터 유지)
					if (notification.data?.centerId) {
						const centerId = notification.data.centerId as string;
						const centerName =
							(notification.data?.centerName as string) ||
							notification.title;

						setSelectedCenter({
							centerId,
							centerName,
							status: "USER",
						});
					} else if (selectedCenter?.centerId) {
						setSelectedCenter({
							...selectedCenter,
							status: "USER",
						});
					}

					// 쿼리 무효화
					queryClient.invalidateQueries({ queryKey: ["myCenters"] });
					queryClient.invalidateQueries({
						queryKey: ["myJoinRequestCenters"],
					});
					queryClient.invalidateQueries({
						queryKey: ["centerCities"],
					});
					queryClient.invalidateQueries({
						queryKey: ["centerSearch"],
					});

					// 홈으로 이동
					navigate("/");
				} else {
					// 거절된 경우
					// 쿼리 무효화
					queryClient.invalidateQueries({ queryKey: ["myCenters"] });
					queryClient.invalidateQueries({
						queryKey: ["myJoinRequestCenters"],
					});
					queryClient.invalidateQueries({
						queryKey: ["centerCities"],
					});
					queryClient.invalidateQueries({
						queryKey: ["centerSearch"],
					});
				}
			}
		},
		[
			removeNotification,
			navigate,
			closeNotificationPanel,
			queryClient,
			setSelectedCenter,
			setIsCenterMember,
			selectedCenter,
		],
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
				if (payload.notification) {
					// 알림 정보 추출
					const title = payload.notification.title || "알림";
					const body = payload.notification.body || "";

					// 가입 신청 관련 알림 처리
					// title에 센터 이름이 포함되어 있고, body에 true/false가 포함되어 있는지 확인
					if (title && (body === "true" || body === "false")) {
						const isApproved = body === "true";
						const centerName = title;

						// 간단한 토스트 알림만 표시 (상세 처리는 알림 클릭 시 수행)
						if (isApproved) {
							setIsCenterMember(true);
							setSelectedCenter({
								centerId: selectedCenter.centerId,
								centerName: selectedCenter.centerName,
								status: "USER",
							});
							// 승인 알림
							toast.success(
								`${centerName}에 가입이 승인되었습니다`,
								{
									duration: 5000,
								},
							);

							// 자동으로 쿼리 무효화 (UI 갱신용)
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
							// 거절 알림
							toast.error(
								`${centerName} 가입 신청이 거절되었습니다`,
								{
									duration: 5000,
								},
							);

							// 자동으로 쿼리 무효화 (UI 갱신용)
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
								// centerId와 centerName 추가 (현재 선택된 센터 정보 저장)
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
		selectedCenter?.centerId,
		selectedCenter?.centerName,
		setupFCM,
		addNotification,
		queryClient,
		setIsCenterMember,
		setSelectedCenter,
	]);

	// 앱 초기화 시 권한 상태 확인
	useEffect(() => {
		checkNotificationPermission();
	}, [checkNotificationPermission]);

	return {
		notifications,
		unreadCount,
		isLoading,
		isNotificationOpen,
		permissionStatus,
		toggleNotificationPanel,
		closeNotificationPanel,
		handleNotificationClick,
		clearAllNotifications,
		checkNotificationPermission,
		requestNotificationPermission,
		// refetchNotifications,
		// refetchUnreadCount,
	};
};

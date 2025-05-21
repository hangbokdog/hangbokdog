import { useEffect, useState, useCallback } from "react";
import React from "react";
import {
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from "@tanstack/react-query";
import {
	fetchNotifications,
	markNotificationsAsRead,
	deleteNotification,
	registerFCMToken,
	type NotificationResponse,
	type NotificationItem,
	deleteAllNotifications,
} from "@/api/notification";
import { requestFCMToken, onForegroundMessage } from "@/config/firebase";
import useNotificationStore from "@/lib/store/notificationStore";
import useCenterStore from "@/lib/store/centerStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "@/lib/store/authStore";

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
	const { selectedCenter, setIsCenterMember, setSelectedCenter } =
		useCenterStore();
	const { user } = useAuthStore();
	const {
		isNotificationOpen,
		toggleNotificationPanel,
		closeNotificationPanel: storeCloseNotificationPanel,
	} = useNotificationStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	// 알림 목록을 가져오는 useInfiniteQuery
	const {
		data: notificationsData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingNotifications,
		refetch: refetchNotifications,
	} = useInfiniteQuery({
		queryKey: ["notifications"],
		queryFn: async ({ pageParam }) => {
			return fetchNotifications(pageParam as string | null);
		},
		getNextPageParam: (lastPage: NotificationResponse) => {
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		initialPageParam: null as string | null,
		enabled: !!user.accessToken, // 로그인된 경우에만 알림 가져오기
	});

	// 모든 알림 데이터 가져오기
	const notifications =
		notificationsData?.pages.flatMap((page) => page.data) || [];

	// 읽지 않은 알림 수 계산
	const unreadCount = notifications.filter(
		(notification) => !notification.isRead,
	).length;

	// 알림 읽음 처리 뮤테이션
	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (notificationIds: number[]) =>
			markNotificationsAsRead(notificationIds),
		onSuccess: () => {
			// 알림 목록 갱신
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("알림 읽음 처리 실패:", error);
		},
	});

	// 알림 삭제 뮤테이션
	const { mutate: deleteMutation } = useMutation({
		mutationFn: (notificationId: number) =>
			deleteNotification(notificationId),
		onSuccess: () => {
			// 알림 목록 갱신
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			console.error("알림 삭제 실패:", error);
		},
	});

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

	// FCM 토큰 요청 및 등록 - 로그인 확인 로직 추가
	const setupFCM = useCallback(async () => {
		// 로그인 상태와 센터 선택 확인
		if (!selectedCenter?.centerId || !user.accessToken) return;

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
			}

			if (token) {
				try {
					await registerFCMToken(token, selectedCenter.centerId);
					console.log("FCM 토큰 등록 성공");
				} catch (registerError) {
					console.error("FCM 토큰 서버 등록 실패:", registerError);
				}
			}
		} catch (error) {
			console.error("FCM 설정 오류:", error);
		} finally {
			setIsLoading(false);
		}
	}, [
		selectedCenter?.centerId,
		checkNotificationPermission,
		user.accessToken,
	]);

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

	// 알림 읽음 처리 함수
	const handleMarkAsRead = useCallback(
		(notificationId: number) => {
			markAsReadMutation([notificationId]);
		},
		[markAsReadMutation],
	);

	// 알림 패널을 닫을 때 읽지 않은 알림 일괄 처리
	const closeNotificationPanel = useCallback(() => {
		// 읽지 않은 알림을 자동으로 읽음 처리하지 않음
		// 스토어의 패널 닫기 함수 호출
		storeCloseNotificationPanel();
	}, [storeCloseNotificationPanel]);

	// 알림 삭제 처리
	const removeNotification = useCallback(
		(notificationId: string) => {
			deleteMutation(Number(notificationId));
		},
		[deleteMutation],
	);

	// 모든 알림을 읽음 처리하는 함수
	const markAllAsRead = useCallback(() => {
		// 읽지 않은 알림 ID들을 수집
		const unreadNotificationIds = notifications
			.filter((notification) => !notification.isRead)
			.map((notification) => notification.notificationId);

		// 읽지 않은 알림이 있으면 읽음 처리
		if (unreadNotificationIds.length > 0) {
			markAsReadMutation(unreadNotificationIds);
			toast.success("모든 알림을 읽음 처리했습니다.");
		} else {
			toast.info("읽지 않은 알림이 없습니다.");
		}
	}, [notifications, markAsReadMutation]);

	// 모든 알림 삭제 처리
	const clearAllNotifications = useCallback(() => {
		if (notifications.length === 0) {
			toast.info("삭제할 알림이 없습니다.");
			return;
		}

		try {
			// deleteAllNotifications API 호출
			deleteAllNotifications()
				.then(() => {
					toast.success("모든 알림이 삭제되었습니다.");
					// 알림 데이터 다시 불러오기
					refetchNotifications();
				})
				.catch((error) => {
					console.error("알림 일괄 삭제 실패:", error);
					toast.error("알림 삭제에 실패했습니다.");
				});
		} catch (error) {
			console.error("알림 일괄 삭제 중 오류 발생:", error);
			toast.error("알림 삭제에 실패했습니다.");
		}
	}, [notifications, refetchNotifications]);

	// 알림 클릭 핸들러
	const handleNotificationClick = useCallback(
		(notification: NotificationItem) => {
			// 알림 읽음 처리
			if (!notification.isRead) {
				handleMarkAsRead(notification.notificationId);
			}

			// 알림 패널 닫기
			storeCloseNotificationPanel();

			// 알림 타입에 따른 처리
			switch (notification.type) {
				case "VOLUNTEER_APPLICATION":
					if (notification.targetId) {
						navigate(
							`/manager/volunteer/applications?id=${notification.targetId}`,
						);
					}
					break;

				case "CENTER_JOIN_REQUEST":
				case "CENTER": {
					// TODO: 센터 가입 요청 알림 처리 로직 구현
					break;
				}

				case "EMERGENCY": {
					// 응급 알림 - 현재는 특별한 처리 없음
					break;
				}

				case "VOLUNTEER": {
					// 봉사활동 신청 알림
					if (notification.targetId) {
						navigate(`/volunteer/${notification.targetId}`);
					}
					break;
				}
			}
		},
		[navigate, storeCloseNotificationPanel, handleMarkAsRead],
	);

	// FCM 포그라운드 알림 리스너 설정 (새 알림이 오면 실시간 처리)
	useEffect(() => {
		// 로그인 상태와 센터 선택 확인
		if (!selectedCenter?.centerId || !user.accessToken) return;

		// FCM 설정
		setupFCM().catch((err) => {
			console.error("FCM 설정 중 오류 발생:", err);
		});

		// 포그라운드 메시지 리스너 (이전 코드 유지)
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
								// 일반 토스트 알림 표시
								toast.info(title, {
									description: content || body,
									duration: 5000,
								});
							}
						}
					} catch (parseError) {
						// JSON 파싱 실패 시 이전 방식으로 처리 (기존 로직 유지)
						console.warn("알림 메시지 파싱 실패:", parseError);

						// 가입 신청 관련 알림 처리 (기존 로직)
						if (title && (body === "true" || body === "false")) {
							const isApproved = body === "true";
							const centerName = title;

							// 간단한 토스트 알림만 표시
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
								// 거절 알림
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
						} else {
							// 일반 알림 처리
							toast.info(title, {
								description: body,
								duration: 5000,
							});
						}
					}

					// 새 알림이 오면 알림 목록 갱신
					refetchNotifications();
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
		user.accessToken,
		refetchNotifications,
		queryClient,
		setIsCenterMember,
		setSelectedCenter,
	]);

	// 앱 초기화 시 권한 상태 확인 및 자동 설정
	useEffect(() => {
		// 로그인 상태와 알림 권한 상태 확인
		if (user.accessToken) {
			checkNotificationPermission().then((permission) => {
				// 이미 권한이 있고 센터가 선택되어 있으면 자동으로 FCM 설정
				if (permission === "granted" && selectedCenter?.centerId) {
					setupFCM().catch((err) => {
						console.error("자동 FCM 설정 중 오류 발생:", err);
					});
				}
			});
		}
	}, [
		checkNotificationPermission,
		setupFCM,
		selectedCenter?.centerId,
		user.accessToken,
	]);

	// 페이지 가시성 변경 감지하여 백그라운드에서 포그라운드로 전환 시 알림 목록 갱신
	useEffect(() => {
		// 로그인 상태 확인
		if (!user.accessToken) return;

		// 페이지 가시성 변경 이벤트 핸들러
		const handleVisibilityChange = () => {
			// 페이지가 다시 보이게 되었을 때 알림 목록 갱신
			if (document.visibilityState === "visible") {
				console.log("앱이 활성화되어 알림 목록을 갱신합니다.");
				refetchNotifications();
			}
		};

		// 이벤트 리스너 등록
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// 컴포넌트 언마운트 시 이벤트 리스너 제거
		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
		};
	}, [user.accessToken, refetchNotifications]);

	return {
		notifications,
		unreadCount,
		isLoading: isLoading || isLoadingNotifications,
		isNotificationOpen,
		permissionStatus,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		toggleNotificationPanel,
		closeNotificationPanel,
		handleNotificationClick,
		clearAllNotifications,
		checkNotificationPermission,
		requestNotificationPermission,
		removeNotification,
		setupFCM,
		refetchNotifications,
		markAllAsRead,
	};
};

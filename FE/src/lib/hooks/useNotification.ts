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
import useAuthStore from "@/lib/store/authStore";

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
	const { user } = useAuthStore(); // 로그인 상태 확인을 위해 추가
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

	// FCM 토큰 요청 및 등록 - 로그인 확인 로직 추가
	const setupFCM = useCallback(async () => {
		// 로그인 상태와 센터 선택 확인
		if (!selectedCenter?.centerId || !user.accessToken) return;

		// notification이 false인 경우 FCM 토큰 등록 건너뛰기
		// if (user.notification === false) {
		// 	console.log(
		// 		"알림이 비활성화되어 있어 FCM 토큰을 등록하지 않습니다.",
		// 	);
		// 	return;
		// }
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
	}, [
		selectedCenter?.centerId,
		checkNotificationPermission,
		user.accessToken,
		// user.notification,
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
			// 알림 읽음 처리
			markAsRead(notification.id);

			// 알림 패널 닫기
			closeNotificationPanel();

			// 알림 타입에 따른 처리
			switch (notification.type) {
				case "VOLUNTEER_APPLICATION":
					if (notification.data?.volunteerId) {
						navigate(
							`/manager/volunteer/applications?id=${notification.data.volunteerId}`,
						);
					}
					break;

				case "CENTER_JOIN_REQUEST":
				case "CENTER": {
					// 센터 가입 요청 알림일 경우
					const isApproved =
						notification.data?.isApproved === true ||
						notification.data?.isApproved === "true";

					if (isApproved) {
						// 승인된 경우
						setIsCenterMember(true);

						setSelectedCenter({
							centerId: selectedCenter?.centerId || "",
							centerName: selectedCenter?.centerName || "",
							status: "USER",
						});

						// 쿼리 무효화
						queryClient.invalidateQueries({
							queryKey: ["myCenters"],
						});
						queryClient.invalidateQueries({
							queryKey: ["myJoinRequestCenters"],
						});

						// 홈으로 이동
						navigate("/");
					} else {
						// 거절된 경우 - 쿼리 무효화
						setIsCenterMember(false);
						setSelectedCenter({
							centerId: selectedCenter?.centerId || "",
							centerName: selectedCenter?.centerName || "",
							status: "NONE",
						});

						queryClient.invalidateQueries({
							queryKey: ["myCenters"],
						});
						queryClient.invalidateQueries({
							queryKey: ["myJoinRequestCenters"],
						});
					}
					break;
				}

				case "EMERGENCY": {
					// 응급 알림 - 현재는 특별한 처리 없음i
					break;
				}

				case "VOLUNTEER": {
					// 봉사활동 신청 알림
					if (notification.data?.volunteerEventId) {
						// 봉사활동 상세 페이지로 이동
						navigate(
							`/volunteer/${notification.data.volunteerEventId}`,
						);
					}
					break;
				}
			}
		},
		[
			markAsRead,
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
		// 로그인 상태와 센터 선택 확인
		if (!selectedCenter?.centerId || !user.accessToken) return;

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
		selectedCenter?.centerId,
		selectedCenter?.centerName,
		setupFCM,
		addNotification,
		queryClient,
		setIsCenterMember,
		setSelectedCenter,
		user.accessToken, // 로그인 상태 변화 감지
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
		removeNotification,
		setupFCM,
		// refetchNotifications,
		// refetchUnreadCount,
	};
};

import localAxios from "./http-commons";

// FCM 토큰을 서버에 등록하는 API
export const registerFCMToken = async (token: string, centerId?: string) => {
	try {
		const response = await localAxios.patch("/members/fcm-token", {
			fcmToken: token,
			// ...(centerId ? { centerId } : {}),
		});
		return response.data;
	} catch (error) {
		console.error("FCM 토큰 등록 실패:", error);
		throw error;
	}
};

// FCM 토큰을 삭제하는 API
export const deleteFCMToken = async () => {
	try {
		const response = await localAxios.delete("/members/fcm-token");
		return response.data;
	} catch (error) {
		console.error("FCM 토큰 삭제 실패:", error);
		throw error;
	}
};

// 봉사 신청 알림을 매니저에게 보내는 API
export const sendVolunteerApplicationNotification = async (
	volunteerId: string,
	centerId: string,
	volunteerDate: string,
	volunteerTime: string,
	userName: string,
) => {
	try {
		const response = await localAxios.post(
			"/notification/volunteer-application",
			{
				volunteerId,
				centerId,
				volunteerDate,
				volunteerTime,
				userName,
			},
		);
		return response.data;
	} catch (error) {
		console.error("봉사 신청 알림 전송 실패:", error);
		throw error;
	}
};

// 알림 목록을 가져오는 API (새로운 API 엔드포인트 형식)
export interface NotificationResponse {
	pageToken: string | null;
	data: NotificationItem[];
	hasNext: boolean;
}

export interface NotificationItem {
	notificationId: number;
	targetId: number;
	type: string;
	title: string;
	content: string;
	createdAt: string;
	isRead: boolean;
}

// 새로운 API 엔드포인트로 알림 목록을 가져오는 함수
export const fetchNotifications = async (pageToken?: string | null) => {
	try {
		const params = new URLSearchParams();
		if (pageToken) params.append("pageToken", pageToken);

		const response = await localAxios.get<NotificationResponse>(
			`/notifications${params.toString() ? `?${params.toString()}` : ""}`,
		);
		return response.data;
	} catch (error) {
		console.error("알림 목록 조회 실패:", error);
		throw error;
	}
};

// 알림을 읽음 처리하는 API (새로운 버전)
export const markNotificationsAsRead = async (notificationIds: number[]) => {
	try {
		if (notificationIds.length === 0) return { success: true };

		const response = await localAxios.patch("/notifications", {
			notificationIds,
		});
		return response.data;
	} catch (error) {
		console.error("알림 읽음 처리 실패:", error);
		throw error;
	}
};

// 알림을 삭제하는 API (새로운 버전)
export const deleteNotification = async (notificationId: number) => {
	try {
		const response = await localAxios.delete(
			`/notifications/${notificationId}`,
		);
		return response.data;
	} catch (error) {
		console.error("알림 삭제 실패:", error);
		throw error;
	}
};

// 이전 API 함수들 (추후 삭제 예정)

// 이전 알림 목록을 가져오는 API
export const fetchOldNotifications = async (
	centerId?: string,
	page = 1,
	size = 10,
) => {
	try {
		const params = new URLSearchParams();
		if (centerId) params.append("centerId", centerId);
		params.append("page", page.toString());
		params.append("size", size.toString());

		const response = await localAxios.get(
			`/notification/list?${params.toString()}`,
		);
		return response.data;
	} catch (error) {
		console.error("알림 목록 조회 실패:", error);
		throw error;
	}
};

// 알림을 읽음 처리하는 API
export const markNotificationAsRead = async (notificationId: string) => {
	try {
		const response = await localAxios.put(
			`/notification/${notificationId}/read`,
		);
		return response.data;
	} catch (error) {
		console.error("알림 읽음 처리 실패:", error);
		throw error;
	}
};

// 알림 개수를 조회하는 API
export const getUnreadNotificationsCount = async (centerId?: string) => {
	try {
		const params = new URLSearchParams();
		if (centerId) params.append("centerId", centerId);

		const response = await localAxios.get(
			`/notification/unread-count?${params.toString()}`,
		);
		return response.data.count || 0;
	} catch (error) {
		console.error("읽지 않은 알림 개수 조회 실패:", error);
		throw error;
	}
};

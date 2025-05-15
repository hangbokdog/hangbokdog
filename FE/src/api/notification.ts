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

// 알림 목록을 가져오는 API
export const fetchNotifications = async (
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

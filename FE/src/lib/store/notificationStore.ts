import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
	id: string;
	title: string;
	body: string;
	data?: Record<string, string | number | boolean | null | undefined>;
	isRead: boolean;
	createdAt: string;
	type: "VOLUNTEER_APPLICATION" | "SYSTEM" | "INFO" | "CENTER_JOIN_REQUEST";
}

interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	isNotificationOpen: boolean;
	addNotification: (notification: Notification) => void;
	setNotifications: (notifications: Notification[]) => void;
	markAsRead: (notificationId: string) => void;
	removeNotification: (notificationId: string) => void;
	clearAllNotifications: () => void;
	setUnreadCount: (count: number) => void;
	incrementUnreadCount: () => void;
	decrementUnreadCount: () => void;
	resetUnreadCount: () => void;
	toggleNotificationPanel: () => void;
	closeNotificationPanel: () => void;
}

// localStorage를 사용하여 알림 데이터 유지
const useNotificationStore = create<NotificationState>()(
	persist(
		(set) => ({
			notifications: [],
			unreadCount: 0,
			isNotificationOpen: false,

			addNotification: (notification) =>
				set((state) => ({
					notifications: [notification, ...state.notifications],
					unreadCount: state.unreadCount + 1,
				})),

			setNotifications: (notifications) => set(() => ({ notifications })),

			markAsRead: (notificationId) =>
				set((state) => {
					const newNotifications = state.notifications.map(
						(notification) =>
							notification.id === notificationId
								? { ...notification, isRead: true }
								: notification,
					);

					// 읽지 않은 알림 수 계산
					const newUnreadCount = newNotifications.filter(
						(notification) => !notification.isRead,
					).length;

					return {
						notifications: newNotifications,
						unreadCount: newUnreadCount,
					};
				}),

			removeNotification: (notificationId) =>
				set((state) => {
					const notification = state.notifications.find(
						(n) => n.id === notificationId,
					);
					const isUnread = notification && !notification.isRead;

					const newNotifications = state.notifications.filter(
						(notification) => notification.id !== notificationId,
					);

					// 읽지 않은 알림이 삭제된 경우 unreadCount 감소
					return {
						notifications: newNotifications,
						unreadCount: isUnread
							? Math.max(0, state.unreadCount - 1)
							: state.unreadCount,
					};
				}),

			clearAllNotifications: () =>
				set(() => ({
					notifications: [],
					unreadCount: 0,
				})),

			setUnreadCount: (count) => set(() => ({ unreadCount: count })),
			incrementUnreadCount: () =>
				set((state) => ({ unreadCount: state.unreadCount + 1 })),
			decrementUnreadCount: () =>
				set((state) => ({
					unreadCount: Math.max(0, state.unreadCount - 1),
				})),
			resetUnreadCount: () => set(() => ({ unreadCount: 0 })),
			toggleNotificationPanel: () =>
				set((state) => ({
					isNotificationOpen: !state.isNotificationOpen,
				})),
			closeNotificationPanel: () =>
				set(() => ({ isNotificationOpen: false })),
		}),
		{
			name: "notifications-storage", // localStorage 키 이름
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useNotificationStore;

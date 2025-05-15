import { create } from "zustand";

export interface Notification {
	id: string;
	title: string;
	body: string;
	data?: Record<string, string | number | boolean | null | undefined>;
	isRead: boolean;
	createdAt: string;
	type: "VOLUNTEER_APPLICATION" | "SYSTEM" | "INFO";
}

interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	isNotificationOpen: boolean;
	addNotification: (notification: Notification) => void;
	setNotifications: (notifications: Notification[]) => void;
	markAsRead: (notificationId: string) => void;
	setUnreadCount: (count: number) => void;
	incrementUnreadCount: () => void;
	decrementUnreadCount: () => void;
	resetUnreadCount: () => void;
	toggleNotificationPanel: () => void;
	closeNotificationPanel: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
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
		set((state) => ({
			notifications: state.notifications.map((notification) =>
				notification.id === notificationId
					? { ...notification, isRead: true }
					: notification,
			),
		})),

	setUnreadCount: (count) => set(() => ({ unreadCount: count })),
	incrementUnreadCount: () =>
		set((state) => ({ unreadCount: state.unreadCount + 1 })),
	decrementUnreadCount: () =>
		set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
	resetUnreadCount: () => set(() => ({ unreadCount: 0 })),
	toggleNotificationPanel: () =>
		set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
	closeNotificationPanel: () => set(() => ({ isNotificationOpen: false })),
}));

export default useNotificationStore;

import { create } from "zustand";

interface NotificationState {
	isNotificationOpen: boolean;
	toggleNotificationPanel: () => void;
	closeNotificationPanel: () => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
	isNotificationOpen: false,
	toggleNotificationPanel: () =>
		set((state) => ({
			isNotificationOpen: !state.isNotificationOpen,
		})),
	closeNotificationPanel: () => set({ isNotificationOpen: false }),
}));

export default useNotificationStore;

import { create } from "zustand";

interface User {
	accessToken: string | null;
	name: string | null;
	tempToken: string | null;
	memberId: number | null;
	nickName: string | null;
	profileImage: string | null;
	notification: boolean | null;
}

interface AuthState {
	user: User;
	setToken: (token: string) => void;
	setName: (name: string) => void;
	setTempToken: (token: string) => void;
	setUserInfo: (
		memberId: number,
		nickName: string,
		profileImage: string,
		notification: boolean,
	) => void;
	clearAuth: () => void;
}

const getStoredUser = (): User => {
	return {
		accessToken: sessionStorage.getItem("accessToken"),
		name: sessionStorage.getItem("name"),
		tempToken: null,
		memberId: sessionStorage.getItem("memberId")
			? Number(sessionStorage.getItem("memberId"))
			: null,
		nickName: sessionStorage.getItem("nickName"),
		profileImage: sessionStorage.getItem("profileImage"),
		notification: sessionStorage.getItem("notification")
			? sessionStorage.getItem("notification") === "true"
			: null,
	};
};

const useAuthStore = create<AuthState>()((set) => ({
	user: getStoredUser(),
	setToken: (token: string) => {
		sessionStorage.setItem("accessToken", token);
		set((state) => ({
			user: { ...state.user, accessToken: token },
		}));
	},
	setName: (name: string) => {
		sessionStorage.setItem("name", name);
		set((state) => ({
			user: { ...state.user, name },
		}));
	},
	setTempToken: (token: string) => {
		set((state) => ({
			user: { ...state.user, tempToken: token },
		}));
	},
	setUserInfo: (
		memberId: number,
		nickName: string,
		profileImage: string,
		notification: boolean,
	) => {
		sessionStorage.setItem("memberId", memberId.toString());
		sessionStorage.setItem("nickName", nickName);
		sessionStorage.setItem("profileImage", profileImage);
		sessionStorage.setItem("notification", notification.toString());
		set((state) => ({
			user: {
				...state.user,
				memberId,
				nickName,
				profileImage,
				notification,
			},
		}));
	},
	clearAuth: () => {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("name");
		sessionStorage.removeItem("memberId");
		sessionStorage.removeItem("nickName");
		sessionStorage.removeItem("profileImage");
		sessionStorage.removeItem("notification");
		set({
			user: {
				accessToken: null,
				name: null,
				tempToken: null,
				memberId: null,
				nickName: null,
				profileImage: null,
				notification: null,
			},
		});
	},
}));

export default useAuthStore;

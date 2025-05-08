import { create } from "zustand";

interface User {
	accessToken: string | null;
	name: string | null;
	tempToken: string | null;
}

interface AuthState {
	user: User;
	setToken: (token: string) => void;
	setName: (name: string) => void;
	setTempToken: (token: string) => void;
	clearAuth: () => void;
}

const getStoredUser = (): User => {
	return {
		accessToken: sessionStorage.getItem("accessToken"),
		name: sessionStorage.getItem("name"),
		tempToken: null,
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
	clearAuth: () => {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("name");
		set({
			user: {
				accessToken: null,
				name: null,
				tempToken: null,
			},
		});
	},
}));

export default useAuthStore;

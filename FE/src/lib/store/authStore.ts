import { create } from "zustand";

interface AuthState {
	user: {
		accessToken: string | null;
		name: string | null;
		tempToken: string | null;
	};
	setToken: (token: string) => void;
	setName: (name: string) => void;
	setTempToken: (token: string) => void;
	clearAuth: () => void;
}

const getStoredToken = (): string | null => {
	return sessionStorage.getItem("accessToken");
};

const getStoredName = (): string | null => {
	return sessionStorage.getItem("name");
};

const useAuthStore = create<AuthState>()((set) => ({
	user: {
		accessToken: getStoredToken(),
		name: getStoredName(),
		tempToken: null,
	},
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
		set((state) => ({
			user: {
				...state.user,
				accessToken: null,
				name: null,
				tempToken: null,
			},
		}));
	},
}));

export default useAuthStore;

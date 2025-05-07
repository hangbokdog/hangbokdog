import { create } from "zustand";

interface AuthState {
	accessToken: string | null;
	name: string | null;
	tempToken: string | null;
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
	accessToken: getStoredToken(),
	name: getStoredName(),
	tempToken: null,
	setToken: (token: string) => {
		sessionStorage.setItem("accessToken", token);
		set({ accessToken: token });
	},
	setName: (name: string) => {
		sessionStorage.setItem("name", name);
		set({ name });
	},
	setTempToken: (token: string) => {
		set({ tempToken: token });
	},
	clearAuth: () => {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("name");
		set({ accessToken: null, name: null, tempToken: null });
	},
}));

export default useAuthStore;

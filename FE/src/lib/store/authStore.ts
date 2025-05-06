import { create } from "zustand";

interface AuthState {
	accessToken: string | null;
	name: string | null;
	setToken: (token: string) => void;
	setName: (name: string) => void;
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
	setToken: (token: string) => {
		sessionStorage.setItem("accessToken", token);
		set({ accessToken: token });
	},
	setName: (name: string) => {
		sessionStorage.setItem("name", name);
		set({ name });
	},
	clearAuth: () => {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("name");
		set({ accessToken: null, name: null });
	},
}));

export default useAuthStore;

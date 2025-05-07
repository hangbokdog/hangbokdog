import axios from "axios";
import useAuthStore from "@/lib/store/authStore";

const localAxios = axios.create({
	baseURL: `${import.meta.env.VITE_API_URI}`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json;charset=utf-8",
	},
});

localAxios.interceptors.request.use(
	(config) => {
		let token = useAuthStore.getState().user.accessToken;

		if (!token) {
			token = sessionStorage.getItem("accessToken");
		}

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default localAxios;

import type { CheckNicknameResponse, OauthLoginResponse } from "@/types/auth";
import localAxios from "./http-commons";
import axios from "axios";
import useAuthStore from "@/lib/store/authStore";

export const NaverLoginAPI = async ({
	code,
	state,
}: {
	code: string;
	state: string;
}): Promise<OauthLoginResponse> => {
	const response = await localAxios.post<OauthLoginResponse>(
		"auth/login/naver",
		{
			code,
			state,
		},
	);
	return response.data;
};

export const checkNicknameAPI = async (
	nickname: string,
): Promise<CheckNicknameResponse> => {
	const response = await localAxios.get<CheckNicknameResponse>(
		`auth/duplicate-check?nickname=${nickname}`,
	);
	return response.data;
};

export const signUpAPI = async ({
	name,
	nickname,
	phoneNumber,
	birthDate,
}: {
	name: string;
	nickname: string;
	phoneNumber: string;
	birthDate: string;
}) => {
	const tempToken = useAuthStore.getState().tempToken;
	const response = await axios.post(
		`${import.meta.env.VITE_API_URI}auth/sign-up`,
		{
			name,
			nickname,
			phoneNumber,
			birth: birthDate,
		},
		{
			withCredentials: true,
			headers: {
				"Content-Type": "application/json;charset=utf-8",
				Authorization: `Bearer ${tempToken}`,
			},
		},
	);
	return response.data;
};

export const logoutAPI = async () => {
	const response = await localAxios.post("auth/logout");
	return response.data;
};

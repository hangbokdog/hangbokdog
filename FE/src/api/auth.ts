import type { OauthLoginResponse } from "@/types/auth";
import localAxios from "./http-commons";

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
	const response = await localAxios.post("auth/sign-up", {
		name,
		nickname,
		phoneNumber,
		birth: birthDate,
	});
	return response.data;
};

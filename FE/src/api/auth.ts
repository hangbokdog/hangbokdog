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

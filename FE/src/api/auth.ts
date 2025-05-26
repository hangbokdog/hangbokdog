import type {
	CheckNicknameResponse,
	NicknameSearchResponse,
	OauthLoginResponse,
	UserInfoResponse,
	UpdateUserInfoRequest,
} from "@/types/auth";
import localAxios from "./http-commons";
import axios from "axios";
import useAuthStore from "@/lib/store/authStore";
import type { MyCenter } from "@/types/center";

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
	const tempToken = useAuthStore.getState().user.tempToken;
	const response = await axios.get<CheckNicknameResponse>(
		`${import.meta.env.VITE_API_URI}auth/duplicate-check?nickname=${nickname}`,
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

export const signUpAPI = async ({
	name,
	nickname,
	phoneNumber,
	birthDate,
	emergencyNotification = false,
}: {
	name: string;
	nickname: string;
	phoneNumber: string;
	birthDate: string;
	emergencyNotification: boolean;
}) => {
	const tempToken = useAuthStore.getState().user.tempToken;
	const response = await axios.post(
		`${import.meta.env.VITE_API_URI}auth/sign-up`,
		{
			name,
			nickname,
			phone: phoneNumber,
			birth: birthDate,
			emergencyNotification,
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

export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
	const response = await localAxios.get<UserInfoResponse>("members/my");
	return response.data;
};

export const getNicknameSearchAPI = async ({
	nickname,
}: {
	nickname: string;
}): Promise<NicknameSearchResponse> => {
	const response = await localAxios.get<NicknameSearchResponse>(
		"/members/search",
		{
			params: {
				nickname,
			},
		},
	);
	return response.data;
};

/**
 * 내 정보 수정 API
 * - nickname: 새 닉네임
 * - profileImageFile: 선택적 프로필 이미지 파일
 */
export const updateUserInfoAPI = async ({
	nickName,
	profileImageFile,
}: UpdateUserInfoRequest): Promise<UserInfoResponse> => {
	const formData = new FormData();

	// 서버가 기대하는 구조에 맞게 JSON 객체를 문자열로 추가
	formData.append(
		"request",
		new Blob([JSON.stringify({ nickName })], { type: "application/json" }),
	);

	if (profileImageFile instanceof File) {
		formData.append("files", profileImageFile);
	}

	const response = await localAxios.patch<UserInfoResponse>(
		"members/my",
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

export const getMyMainCenterInfoAPI = async (): Promise<MyCenter> => {
	const response = await localAxios.get<MyCenter>("/centers/main");
	return response.data;
};

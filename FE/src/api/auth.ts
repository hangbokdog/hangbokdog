import type {
	CheckNicknameResponse,
	NicknameSearchResponse,
	OauthLoginResponse,
	UserInfoResponse,
} from "@/types/auth";
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
}: {
	name: string;
	nickname: string;
	phoneNumber: string;
	birthDate: string;
}) => {
	const tempToken = useAuthStore.getState().user.tempToken;
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

export interface UpdateUserInfoRequest {
  nickname: string;
  profileImageFile?: File | null;
}

/**
 * 내 정보 수정 API
 * - nickname: 새 닉네임
 * - profileImageFile: 선택적 프로필 이미지 파일
 */
export const updateUserInfoAPI = async ({
  nickname,
  profileImageFile,
}: UpdateUserInfoRequest): Promise<UserInfoResponse> => {
  const formData = new FormData();

  // JSON 형태의 nickname 객체를 'request' 필드에 담아서 전송
  formData.append("request", JSON.stringify({ nickname }));

  // 파일이 있을 때만 'files' 필드로 추가
  if (profileImageFile) {
    formData.append("files", profileImageFile);
  }

  // PATCH /members/my (baseURL + "/members/my")
  const response = await localAxios.patch<UserInfoResponse>(
    "members/my",
    formData,
    {
      headers: {
        // 기본 application/json 헤더를 덮어쓰기
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

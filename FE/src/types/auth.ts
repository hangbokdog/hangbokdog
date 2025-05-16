export interface OauthLoginResponse {
	accessToken: string;
	isRegistered: boolean;
	name: string;
}

export interface CheckNicknameResponse {
	isDuplicated: boolean;
}

export interface UserInfoResponse {
	memberId: number;
	name: string;
	nickName: string;
	profileImage: string;
}

export interface NicknameSearchResponse {
	id: number;
	nickName: string;
	name: string;
	phone: string;
	age: number;
	grade: string;
	profileImage: string;
}

export interface UpdateUserInfoRequest {
	nickName: string;
	profileImageFile?: File | null;
}

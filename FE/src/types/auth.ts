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

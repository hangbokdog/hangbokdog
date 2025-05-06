export interface OauthLoginResponse {
	accessToken: string;
	isRegistered: boolean;
	name: string;
}

export interface CheckNicknameResponse {
	isDuplicated: boolean;
}

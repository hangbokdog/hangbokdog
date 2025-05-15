import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { NaverLoginAPI, getUserInfoAPI } from "@/api/auth";
import { registerFCMToken } from "@/api/notification";
import type { OauthLoginResponse } from "@/types/auth";
import useAuthStore from "@/lib/store/authStore";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { requestFCMToken } from "@/config/firebase";

export default function NaverCallback() {
	const navigate = useNavigate();
	const { setToken, setName, setTempToken, setUserInfo } = useAuthStore();

	// FCM 토큰을 요청하고 백엔드에 저장하는 함수
	const handleFCMTokenSetup = useCallback(async () => {
		try {
			// FCM 토큰 요청
			const fcmToken = await requestFCMToken();

			if (fcmToken) {
				console.log("FCM 토큰 등록 시작:", fcmToken);

				// 토큰을 백엔드에 저장
				await registerFCMToken(fcmToken);
				console.log("FCM 토큰 등록 성공");
			} else {
				console.warn("FCM 토큰을 가져올 수 없어 등록할 수 없습니다.");
			}
		} catch (error) {
			console.error("FCM 토큰 처리 중 오류 발생:", error);
			// FCM 토큰 등록 실패는 사용자 경험에 영향을 주지 않도록 처리
		}
	}, []);

	useEffect(() => {
		const handleNaverLogin = async () => {
			const query = new URLSearchParams(window.location.search);
			const code = query.get("code");
			const state = query.get("state");

			if (!code) {
				toast.error("네이버 인증 코드를 받아올 수 없습니다.");
				navigate("/login");
				return;
			}

			if (!state) {
				toast.error("네이버 인증 상태를 받아올 수 없습니다.");
				navigate("/login");
				return;
			}

			try {
				const NaverLoginResponse: OauthLoginResponse =
					await NaverLoginAPI({
						code,
						state,
					});

				setName(NaverLoginResponse.name);

				if (NaverLoginResponse.isRegistered) {
					setToken(NaverLoginResponse.accessToken);

					// 유저 정보 가져오기
					try {
						const userInfo = await getUserInfoAPI();
						setUserInfo(
							userInfo.memberId,
							userInfo.nickName,
							userInfo.profileImage,
						);

						// 로그인 성공 후 FCM 토큰 설정
						await handleFCMTokenSetup();
					} catch (error) {
						console.error(
							"사용자 정보를 가져오는데 실패했습니다:",
							error,
						);
					}

					toast.success("네이버 로그인에 성공하셨습니다.");
					navigate("/");
				} else {
					setTempToken(NaverLoginResponse.accessToken);
					navigate("/signup");
				}
			} catch (error) {
				navigate("/login");
				toast.error("네이버 로그인에 실패하셨습니다.");
			}
		};

		handleNaverLogin();
	}, [
		navigate,
		setToken,
		setName,
		setTempToken,
		setUserInfo,
		handleFCMTokenSetup,
	]);

	return (
		<div className="flex justify-center items-center flex-col mt-40 gap-5">
			<Spinner size="large" />
			<span className="text-2xl font-bold">네이버 로그인 처리 중...</span>
		</div>
	);
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NaverLoginAPI, getUserInfoAPI } from "@/api/auth";
import type { OauthLoginResponse } from "@/types/auth";
import useAuthStore from "@/lib/store/authStore";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

export default function NaverCallback() {
	const navigate = useNavigate();
	const { setToken, setName, setTempToken, setUserInfo } = useAuthStore();

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
	}, [navigate, setToken, setName, setTempToken, setUserInfo]);

	return (
		<div className="flex justify-center items-center flex-col mt-40 gap-5">
			<Spinner size="large" />
			<span className="text-2xl font-bold">네이버 로그인 처리 중...</span>
		</div>
	);
}

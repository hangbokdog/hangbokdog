import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NaverLoginAPI } from "@/api/auth";
import type { OauthLoginResponse } from "@/types/auth";
// import { getUserProfileAPI } from "@/api/user";
// import useAuthStore from "@/lib/store/authStore";
// import useUserStore from "@/lib/store/userStore";
// import type { UserHeaderAPIResponse } from "@/types/MyPage";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

export default function NaverCallback() {
	const navigate = useNavigate();
	// const { setToken } = useAuthStore();
	// const { setUser } = useUserStore();

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
				// 1. 네이버 로그인 API 호출 (비동기 처리)
				const NaverLoginResponse: OauthLoginResponse =
					await NaverLoginAPI({
						code,
						state,
					});

				// 2. 로그인 성공 시 토큰 저장 및 리다이렉트
				// setToken(NaverLoginResponse.accessToken);

				// const userProfile: UserHeaderAPIResponse =
				// 	await getUserProfileAPI();

				// zustand 스토어에 저장
				// setUser(userProfile);

				toast.success("네이버 로그인에 성공하셨습니다.");

				// 신규 회원이면 회원 가입 페이지로 이동
				if (NaverLoginResponse.isRegistered) {
					navigate("/");
				} else {
					navigate("/signup");
				}
			} catch (error) {
				navigate("/login");
				toast.error("네이버 로그인에 실패하셨습니다.");
			}
		};

		handleNaverLogin();
	}, [navigate]);
	// }, [navigate, setToken, setUser, toast]);

	return (
		<div className="flex justify-center items-center flex-col mt-40 gap-5">
			<Spinner size="large" />
			<span className="text-2xl font-bold">네이버 로그인 처리 중...</span>
		</div>
	);
}

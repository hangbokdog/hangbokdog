import { SiNaver } from "react-icons/si";
import { Link } from "react-router-dom";
import { Dog, Heart, PawPrint, Users } from "lucide-react";

export default function Login() {
	const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
	const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;
	const NAVER_STATE = crypto.randomUUID();
	return (
		<div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-5">
			{/* Logo Section */}
			<div className="mt-12 mb-8 flex flex-col items-center">
				<div className="flex items-center gap-2 mb-2">
					<div className="rounded-full p-3">
						<img
							src="/src/assets/logo.png"
							alt="logo"
							className="w-12 h-12"
						/>
					</div>
					<h1 className="text-3xl font-extrabold text-gray-800">
						행복하개
					</h1>
				</div>
				<p className="text-gray-500 text-center text-sm">
					반려동물 보호소 운영 통합 솔루션
				</p>
			</div>

			{/* Main Card */}
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
				{/* Decorative Elements */}
				<div className="bg-male/10 px-6 py-5 flex justify-between items-center">
					<h2 className="text-xl font-bold text-center w-full">
						통합 플랫폼으로
						<br />
						보호소 운영의 혁신을 경험
					</h2>
				</div>

				{/* Content */}
				<div className="p-6">
					<div className="flex flex-col gap-4 items-center">
						<div className="bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-700 flex items-center gap-2 shadow-sm">
							<span className="bg-male text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
								⚡
							</span>
							<span>
								3초만에 로그인하고
								<span className="font-semibold">
									{" "}
									후원️️·입양·봉사{" "}
								</span>
								관리 시작하기
							</span>
						</div>

						{/* Benefits */}
						<div className="grid grid-cols-2 gap-3 w-full my-4">
							<div className="bg-blue-50 p-3 rounded-lg text-center">
								<p className="text-xs text-blue-800 font-medium">
									간편한 입양관리
								</p>
							</div>
							<div className="bg-green-50 p-3 rounded-lg text-center">
								<p className="text-xs text-green-800 font-medium">
									효율적인 봉사관리
								</p>
							</div>
							<div className="bg-yellow-50 p-3 rounded-lg text-center">
								<p className="text-xs text-yellow-800 font-medium">
									체계적인 후원관리
								</p>
							</div>
							<div className="bg-purple-50 p-3 rounded-lg text-center">
								<p className="text-xs text-purple-800 font-medium">
									맞춤형 보호소 관리
								</p>
							</div>
						</div>

						<Link
							className="w-full"
							to={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${NAVER_STATE}`}
						>
							<button
								type="button"
								className="w-full rounded-xl bg-naver inline-flex items-center justify-center gap-2 py-4 hover:brightness-95 transition-all shadow-sm"
							>
								<SiNaver className="text-white" size={20} />
								<span className="text-white font-semibold text-lg">
									네이버로 로그인
								</span>
							</button>
						</Link>

						<p className="text-xs text-gray-500 text-center mt-4">
							로그인 시 당사의{" "}
							<span className="underline">이용약관</span> 및{" "}
							<span className="underline">개인정보처리방침</span>
							에 동의하게 됩니다.
						</p>
					</div>
				</div>
			</div>

			<footer className="mt-8 text-xs text-gray-500 text-center">
				2025 행복하개.
			</footer>
		</div>
	);
}

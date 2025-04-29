import { SiNaver } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Login() {
	const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
	const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;
	const NAVER_STATE = crypto.randomUUID();
	return (
		<div className="p-2.5 pt-10 flex flex-col items-center gap-10 rounded-[8px] bg-white shadow-custom-xs">
			<span className="text-xl font-bold text-center">
				통합 플랫폼으로
				<br />
				보호소 운영의 혁신을 경험
			</span>
			<div className="flex flex-col gap-1 items-center w-full">
				<span className="text-grayText px-2.5 py-0.5 rounded-3xl text-xs shadow-custom-sm">
					⚡ 3초만에 로그인하고
					<span className="font-semibold"> 후원️️·입양·봉사 </span>
					관리 시작하기
				</span>
				<Link
					className="w-full"
					to={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${NAVER_STATE}`}
				>
					<button
						type="button"
						className="w-full rounded-[8px] bg-naver inline-flex items-center justify-center gap-2 py-3"
					>
						<SiNaver className="text-white" size={20} />
						<span className="text-white font-semibold">
							네이버로 로그인
						</span>
					</button>
				</Link>
			</div>
		</div>
	);
}

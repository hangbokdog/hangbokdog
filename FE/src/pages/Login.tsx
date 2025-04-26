import { SiNaver } from "react-icons/si";

export default function Login() {
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
				<button
					type="button"
					className="w-full rounded-[8px] bg-naver inline-flex items-center justify-center gap-2 py-2"
				>
					<SiNaver className="text-white" size={20} />
					<span className="text-white font-semibold">
						네이버로 로그인
					</span>
				</button>
			</div>
		</div>
	);
}

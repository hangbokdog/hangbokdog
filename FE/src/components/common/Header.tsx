import logo from "@/assets/logo.png";
import { FaMoon } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";

export default function Header() {
	const { user } = useAuthStore();
	const { selectedCenter, clearSelectedCenter } = useCenterStore();

	const handleCenterAction = () => {
		switch (selectedCenter?.status) {
			case "신청중":
				// TODO: 신청 취소 API 호출
				toast.success("가입 신청이 취소되었습니다.");
				break;
			case "가입신청":
				// TODO: 가입 신청 API 호출
				toast.success("가입 신청이 완료되었습니다.");
				break;
			default:
				break;
		}
	};

	return (
		<header className="w-full h-12 flex justify-between items-center px-5">
			<Link to={"/"}>
				<div className="flex items-center gap-1.5">
					<img className="w-8" src={logo} alt="logo" />
					<p className="text-2xl font-bold text-[20px] text-main">
						행복하개
					</p>
				</div>
			</Link>
			{selectedCenter?.centerName && (
				<div className="relative group">
					<button
						type="button"
						className="flex items-center gap-1 text-grayText hover:text-main"
					>
						<span>{selectedCenter.centerName}</span>
						<IoIosArrowDown className="size-4" />
					</button>
					<div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-lg py-2 min-w-[150px]">
						<button
							type="button"
							className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
							onClick={() => {
								clearSelectedCenter();
								toast.success("센터를 변경하였습니다.");
							}}
						>
							센터 변경하기
						</button>
					</div>
				</div>
			)}
			<div className="flex items-center gap-3">
				{user.accessToken && selectedCenter?.centerId && (
					<button
						type="button"
						onClick={handleCenterAction}
						className={`px-3 py-1 rounded text-sm ${
							selectedCenter.status === "신청중" ||
							selectedCenter.status === "가입신청"
								? "bg-main text-white"
								: "bg-gray-100 text-gray-500"
						}`}
						disabled={
							selectedCenter.status === "회원" ||
							selectedCenter.status === "매니저"
						}
					>
						{selectedCenter.status === "신청중" && "신청 취소하기"}
						{selectedCenter.status === "회원" && "회원"}
						{selectedCenter.status === "매니저" && "매니저"}
						{selectedCenter.status === "가입신청" &&
							"가입 신청하기"}
					</button>
				)}

				<FaMoon className="size-6" />
			</div>
		</header>
	);
}

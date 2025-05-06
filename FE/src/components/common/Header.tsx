import logo from "@/assets/logo.png";
import { FaMoon } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logoutAPI } from "@/api/auth";
import useAuthStore from "@/lib/store/authStore";
import { toast } from "sonner";

export default function Header() {
	const navigate = useNavigate();
	const { accessToken, clearAuth } = useAuthStore();

	const logoutMutation = useMutation({
		mutationFn: logoutAPI,
		onSuccess: () => {
			clearAuth();

			toast.success("로그아웃되었습니다.");

			navigate("/");
		},
		onError: () => {
			toast.error("로그아웃에 실패했습니다.");

			clearAuth();
			navigate("/");
		},
	});

	const handleLogout = () => {
		logoutMutation.mutate();
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
			<div className="flex items-center gap-3">
				{accessToken && (
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center gap-1 text-grayText hover:text-main"
						title="로그아웃"
					>
						<MdLogout className="size-5" />
						<span className="text-sm">로그아웃</span>
					</button>
				)}
				<FaMoon className="size-6" />
			</div>
		</header>
	);
}

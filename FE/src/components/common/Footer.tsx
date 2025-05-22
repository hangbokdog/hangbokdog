import { FaDog, FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { MdHome, MdLogin } from "react-icons/md";
import { useLocation } from "react-router-dom";
import FooterItem from "./FooterItem";
import useAuthStore from "@/lib/store/authStore";

export default function Footer() {
	const location = useLocation();
	const { user } = useAuthStore();

	// 각 메뉴 아이템별 색상 지정
	const menuItems = [
		{
			path: "/",
			icon: MdHome,
			size: 24,
			label: "홈",
			activeColor: "#3B82F6", // 파란색 계열
		},
		{
			path: "/dogs",
			icon: FaDog,
			size: 20,
			label: "아이들",
			activeColor: "#F59E0B", // 오렌지색 계열
		},
		{
			path: "/volunteer",
			icon: FaHandHoldingHeart,
			size: 20,
			label: "봉사",
			activeColor: "#10B981", // 녹색 계열
		},
		// 로그인 상태에 따라 마지막 메뉴 아이템 결정
		user.accessToken
			? {
					path: "/my",
					icon: FaUser,
					size: 20,
					label: "My",
					activeColor: "#8B5CF6", // 보라색 계열
				}
			: {
					path: "/login",
					icon: MdLogin,
					size: 20,
					label: "로그인",
					activeColor: "#8B5CF6", // 보라색 계열
				},
	];

	return (
		<footer className="fixed w-full max-w-[440px] h-16 bottom-0 z-10 mx-auto flex items-center justify-between bg-white rounded-t-[12px] border-t border-[#F4F4F4] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-bottom">
			{menuItems.map((item) => (
				<FooterItem
					key={item.path}
					path={item.path}
					icon={item.icon}
					size={item.size}
					label={item.label}
					isActive={location.pathname === item.path}
					activeColor={item.activeColor}
				/>
			))}
		</footer>
	);
}

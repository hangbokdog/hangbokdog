import logo from "@/assets/logo.png";
import { FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
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
			<FaMoon className="size-6" />
		</header>
	);
}

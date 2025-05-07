import { useNavigate } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white">
			<div className="text-center">
				<div className="flex items-center justify-center gap-2 mb-4">
					<FaPaw className="text-6xl text-main animate-bounce" />
					<h1 className="text-6xl font-bold text-main">404</h1>
					<FaPaw
						className="text-6xl text-main animate-bounce"
						style={{ animationDelay: "0.2s" }}
					/>
				</div>
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					앗! 페이지를 찾을 수 없어요
				</h2>
				<p className="text-gray-600 mb-8">
					강아지가 실수로 페이지를 물어갔나봐요 🐕
				</p>
				<button
					type="button"
					onClick={() => navigate("/")}
					className="px-6 py-3 bg-main text-white rounded-lg hover:bg-main/90 transition-colors flex items-center gap-2 mx-auto"
				>
					<FaPaw />
					홈으로 돌아가기
				</button>
			</div>
		</div>
	);
}

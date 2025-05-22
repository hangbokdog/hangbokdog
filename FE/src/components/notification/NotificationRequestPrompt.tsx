import type React from "react";
import { Bell, BellOff } from "lucide-react";
import { useNotification } from "@/lib/hooks/useNotification";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationRequestPromptProps {
	onClose: () => void;
}

const NotificationRequestPrompt: React.FC<NotificationRequestPromptProps> = ({
	onClose,
}) => {
	const { requestNotificationPermission } = useNotification();

	const handleRequestPermission = async () => {
		const result = await requestNotificationPermission();
		onClose(); // 권한 요청 후 닫기
	};

	return (
		<div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2">
			<AnimatePresence>
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					transition={{ type: "spring", damping: 20, stiffness: 300 }}
					className="bg-white rounded-xl shadow-lg overflow-hidden"
				>
					<div className="p-4">
						{/* 아이콘 */}
						<div className="flex justify-center mb-4">
							<div className="bg-main/10 p-4 rounded-full">
								<Bell size={32} className="text-main" />
							</div>
						</div>

						{/* 제목 */}
						<h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
							알림 수신 동의
						</h3>

						{/* 설명 */}
						<p className="text-gray-600 text-sm text-center mb-4">
							입양 신청 알림, 센터 가입 승인 등 중요한 소식을
							알림으로 받아보세요.
						</p>

						{/* 이점 목록 */}
						<div className="bg-gray-50 rounded-lg p-3 mb-4">
							<ul className="space-y-2">
								<li className="flex items-start gap-2 text-sm text-gray-700">
									<span className="flex-shrink-0 text-main">
										•
									</span>
									<span>
										반려동물 입양 신청 현황을 실시간으로
										확인
									</span>
								</li>
								<li className="flex items-start gap-2 text-sm text-gray-700">
									<span className="flex-shrink-0 text-main">
										•
									</span>
									<span>보호소 가입 승인 알림 수신</span>
								</li>
								<li className="flex items-start gap-2 text-sm text-gray-700">
									<span className="flex-shrink-0 text-main">
										•
									</span>
									<span>
										중요한 공지사항과 이벤트 정보 안내
									</span>
								</li>
							</ul>
						</div>

						{/* 버튼 */}
						<div className="flex flex-col gap-3">
							<button
								type="button"
								onClick={handleRequestPermission}
								className="w-full py-3 bg-main text-white font-medium rounded-lg hover:bg-main/90 transition-colors"
							>
								알림 허용하기
							</button>
							<button
								type="button"
								onClick={onClose}
								className="w-full py-3 bg-white text-gray-500 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
							>
								다음에 하기
							</button>
						</div>

						{/* 안내 문구 */}
						<p className="text-xs text-gray-400 text-center mt-3">
							언제든지 브라우저 설정에서 알림 권한을 변경할 수
							있습니다.
						</p>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default NotificationRequestPrompt;

import type React from "react";
import { useState } from "react";
import { BellOff, Settings, X, ChevronRight, AlertCircle } from "lucide-react";
import {
	useNotification,
	NotificationPermissionStatus,
} from "@/lib/hooks/useNotification";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationPermissionGuideProps {
	onClose: () => void;
}

const NotificationPermissionGuide: React.FC<
	NotificationPermissionGuideProps
> = ({ onClose }) => {
	const [isTipsOpen, setIsTipsOpen] = useState(false);
	const { permissionStatus } = useNotification();

	// 브라우저 및 OS 감지
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isAndroid = /Android/.test(navigator.userAgent);
	const isMobile = isIOS || isAndroid;
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	const isChrome =
		/chrome/i.test(navigator.userAgent) &&
		!/edge/i.test(navigator.userAgent);

	const getTipsForBrowser = () => {
		if (isIOS && isSafari) {
			return (
				<ol className="list-decimal pl-5 space-y-2 text-sm">
					<li>
						iPhone의 <strong>설정</strong> 앱을 엽니다
					</li>
					<li>
						<strong>Safari</strong>를 찾아 탭합니다
					</li>
					<li>아래로 스크롤하여 웹사이트 설정을 찾습니다</li>
					<li>
						행복하개 웹사이트를 찾아 <strong>알림</strong> 권한을
						허용으로 변경합니다
					</li>
				</ol>
			);
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (isAndroid && isChrome) {
			return (
				<ol className="list-decimal pl-5 space-y-2 text-sm">
					<li>
						Chrome 앱을 열고 주소창에{" "}
						<strong>chrome://settings/content/notifications</strong>
						를 입력합니다
					</li>
					<li>차단된 사이트 목록에서 행복하개 웹사이트를 찾습니다</li>
					<li>
						탭하여 <strong>허용</strong>으로 변경합니다
					</li>
				</ol>
			);
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (isChrome) {
			return (
				<ol className="list-decimal pl-5 space-y-2 text-sm">
					<li>
						Chrome 브라우저 주소창 왼쪽의{" "}
						<strong>자물쇠/정보</strong> 아이콘을 클릭합니다
					</li>
					<li>
						<strong>사이트 설정</strong>을 클릭합니다
					</li>
					<li>
						알림 설정에서 <strong>허용</strong>으로 변경합니다
					</li>
				</ol>
			);
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else {
			return (
				<ol className="list-decimal pl-5 space-y-2 text-sm">
					<li>브라우저 설정 메뉴를 엽니다</li>
					<li>개인정보 및 보안 또는 사이트 설정을 찾습니다</li>
					<li>
						알림 설정에서 행복하개 웹사이트를 찾아 허용으로
						변경합니다
					</li>
				</ol>
			);
		}
	};

	if (permissionStatus !== "denied") {
		return null;
	}

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
					{/* 상단 바 */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
						<div className="flex items-center gap-2">
							<div className="bg-red-100 p-2 rounded-full">
								<BellOff size={16} className="text-red-500" />
							</div>
							<h3 className="font-medium text-gray-900">
								알림이 차단되었습니다
							</h3>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
						>
							<X size={18} />
						</button>
					</div>

					{/* 안내 내용 */}
					<div className="px-4 py-3">
						<p className="text-gray-600 text-sm">
							반려동물 입양 신청과 같은 중요한 알림을 받을 수
							없습니다. 원활한 서비스 이용을 위해 알림을
							허용해주세요.
						</p>

						{/* 팁 버튼 */}
						<button
							type="button"
							onClick={() => setIsTipsOpen(!isTipsOpen)}
							className="mt-3 w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center gap-2">
								<Settings size={14} className="text-gray-500" />
								<span className="text-sm font-medium text-gray-700">
									알림 설정 방법
								</span>
							</div>
							<ChevronRight
								size={18}
								className={`text-gray-400 transform transition-transform ${
									isTipsOpen ? "rotate-90" : ""
								}`}
							/>
						</button>

						{/* 설정 방법 팁 */}
						{isTipsOpen && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="mt-3 bg-gray-50 p-3 rounded-lg"
							>
								<div className="flex items-start gap-2 mb-2">
									<AlertCircle
										size={16}
										className="text-amber-500 flex-shrink-0 mt-0.5"
									/>
									<p className="text-xs text-gray-600">
										브라우저 설정에서 알림 권한을 변경할 수
										있습니다.
									</p>
								</div>
								{getTipsForBrowser()}
							</motion.div>
						)}

						{/* 하단 버튼 */}
						<div className="mt-4 flex gap-2">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
							>
								다음에 하기
							</button>
							<a
								href={
									isIOS
										? "app-settings:"
										: isAndroid && isChrome
											? "chrome://settings/content/notifications"
											: "/"
								}
								className="flex-1 py-2.5 px-4 rounded-lg bg-main text-white text-sm font-medium hover:bg-main/90"
							>
								설정으로 이동
							</a>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default NotificationPermissionGuide;

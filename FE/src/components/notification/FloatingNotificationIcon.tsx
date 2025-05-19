import { IoNotificationsOutline } from "react-icons/io5";
import { useNotification } from "@/lib/hooks/useNotification";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "@/lib/store/notificationStore";
import { X, Trash2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useMatches, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FloatingNotificationIconProps {
	isHeader?: boolean;
}

export default function FloatingNotificationIcon({
	isHeader = false,
}: FloatingNotificationIconProps) {
	const {
		notifications,
		unreadCount,
		toggleNotificationPanel,
		isNotificationOpen,
		closeNotificationPanel,
		handleNotificationClick,
		removeNotification,
		clearAllNotifications,
	} = useNotification();
	const [showFloatingIcon, setShowFloatingIcon] = useState(false);
	const matches = useMatches();
	const navigate = useNavigate();

	// 현재 경로에 Header가 있는지 확인
	const showHeader = matches.reduce((acc, match) => {
		const current = (match.handle as { showHeader?: boolean })?.showHeader;
		return current !== undefined ? current : acc;
	}, true);

	// Header가 없는 경우에만 플로팅 아이콘 표시 (isHeader=true일 경우 무시)
	useEffect(() => {
		if (!isHeader) {
			setShowFloatingIcon(!showHeader);
		} else {
			setShowFloatingIcon(true);
		}
	}, [showHeader, isHeader]);

	// 알림 시간 포맷팅 함수
	const formatNotificationTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const isToday =
			date.getDate() === now.getDate() &&
			date.getMonth() === now.getMonth() &&
			date.getFullYear() === now.getFullYear();

		if (isToday) {
			return formatDistanceToNow(date, { addSuffix: true, locale: ko });
		}

		return format(date, "yyyy.MM.dd HH:mm", { locale: ko });
	};

	// 알림 아이콘에 표시할 뱃지 색상
	const getNotificationBadgeColor = (type: string) => {
		switch (type) {
			case "VOLUNTEER_APPLICATION":
				return "bg-blue-500";
			case "EMERGENCY":
				return "bg-red-500";
			case "VOLUNTEER":
				return "bg-amber-500";
			case "CENTER":
			case "CENTER_JOIN_REQUEST":
				return "bg-green-500";
			case "SYSTEM":
				return "bg-purple-500";
			default:
				return "bg-gray-500";
		}
	};

	// 알림 개별 삭제 처리 함수
	const handleDeleteNotification = (
		e: React.MouseEvent,
		notificationId: string,
	) => {
		e.stopPropagation();
		removeNotification(notificationId);
		toast.success("알림이 삭제되었습니다.");
	};

	// 전체 알림 삭제 처리 함수
	const handleClearAllNotifications = () => {
		clearAllNotifications();
		toast.success("모든 알림이 삭제되었습니다.");
	};

	if (!showFloatingIcon) return null;

	// 헤더에 있는 알림 아이콘인지 플로팅 알림 아이콘인지에 따라 다른 스타일 적용
	const buttonClassNames = isHeader
		? "notification-button flex items-center justify-center text-gray-600 hover:text-main p-1.5 rounded-full hover:bg-gray-50 touch-manipulation relative"
		: "fixed bottom-20 right-4 z-50 bg-white shadow-lg rounded-full p-3 flex items-center justify-center touch-manipulation";

	// 알림 패널의 위치도 헤더에 있는지 여부에 따라 조정
	const panelClassNames = isHeader
		? "notification-panel absolute top-full right-0 mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-100 w-[320px] max-h-[400px] overflow-hidden"
		: "fixed bottom-36 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-100 w-[300px] max-h-[400px] overflow-hidden";

	return (
		<>
			{/* 알림 아이콘 */}
			<button
				type="button"
				className={buttonClassNames}
				aria-label="알림"
				onClick={toggleNotificationPanel}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						toggleNotificationPanel();
					}
				}}
			>
				<IoNotificationsOutline className="w-5 h-5" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{/* 알림 패널 */}
			<AnimatePresence>
				{isNotificationOpen && (
					<div className={panelClassNames}>
						<div className="p-3 border-b border-gray-100 flex items-center justify-between">
							<h3 className="font-medium text-gray-900">알림</h3>
							<div className="flex items-center gap-2">
								{notifications.length > 0 && (
									<button
										type="button"
										className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
										onClick={handleClearAllNotifications}
										title="전체 삭제"
									>
										<Trash2 size={16} />
									</button>
								)}
								<button
									type="button"
									className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
									onClick={closeNotificationPanel}
								>
									<X size={16} />
								</button>
							</div>
						</div>

						<div className="overflow-y-auto max-h-[320px]">
							{notifications.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>알림이 없습니다</p>
								</div>
							) : (
								<div className="divide-y divide-gray-100 overflow-y-auto max-h-[320px]">
									{notifications.map((notification) => (
										<div
											key={notification.id}
											className={`w-full text-left transition-colors flex items-start gap-3 relative ${
												notification.isRead
													? "bg-white"
													: "bg-blue-50/30"
											}`}
										>
											<button
												type="button"
												className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
												onClick={() =>
													handleNotificationClick(
														notification,
													)
												}
											>
												<div
													className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getNotificationBadgeColor(
														notification.type,
													)}`}
												/>
												<div className="flex-1 min-w-0">
													<h4 className="font-medium text-gray-900 text-sm">
														{notification.title}
													</h4>
													<p className="text-gray-600 text-xs mt-1 line-clamp-2">
														{notification.body}
													</p>
													<span className="text-xs text-gray-400 mt-1 block">
														{formatNotificationTime(
															notification.createdAt,
														)}
													</span>
													{(notification.type ===
														"VOLUNTEER" ||
														notification.type ===
															"EMERGENCY") && (
														<div className="mt-1.5">
															<span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
																{notification.type ===
																"VOLUNTEER"
																	? "봉사활동"
																	: "응급 상황"}
															</span>
															{notification.type ===
																"VOLUNTEER" &&
																notification
																	.data
																	?.volunteerEventId && (
																	<span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">
																		상세보기
																	</span>
																)}
														</div>
													)}
												</div>
											</button>
											<button
												type="button"
												className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
												onClick={(e) =>
													handleDeleteNotification(
														e,
														notification.id,
													)
												}
											>
												<Trash2 size={14} />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}

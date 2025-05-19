import logo from "@/assets/logo.png";
import { IoIosArrowDown } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { BuildingIcon, ChevronRightIcon, X, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelJoinRequestAPI, registerCenterAPI } from "@/api/center";
import { useState, useEffect } from "react";
import { useNotification } from "@/lib/hooks/useNotification";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import NotificationPermissionGuide from "../notification/NotificationPermissionGuide";
import NotificationRequestPrompt from "../notification/NotificationRequestPrompt";

type CenterStatus = "NONE" | "APPLIED" | "USER" | "MANAGER";

export default function Header() {
	const { user } = useAuthStore();
	const { selectedCenter, clearSelectedCenter, setSelectedCenter } =
		useCenterStore();
	const queryClient = useQueryClient();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showPermissionGuide, setShowPermissionGuide] = useState(false);
	const [showPermissionRequest, setShowPermissionRequest] = useState(false);
	const navigate = useNavigate();

	// 알림 관련 상태와 함수
	const {
		unreadCount,
		notifications,
		isNotificationOpen,
		permissionStatus,
		toggleNotificationPanel,
		closeNotificationPanel,
		handleNotificationClick,
		clearAllNotifications,
	} = useNotification();

	const { mutate: registerCenter } = useMutation({
		mutationFn: () => registerCenterAPI(selectedCenter?.centerId as string),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			setSelectedCenter({
				centerId: selectedCenter?.centerId as string,
				centerName: selectedCenter?.centerName as string,
				status: "APPLIED",
				centerJoinRequestId: data.centerJoinRequestId,
			});
			toast.success("가입 신청이 완료되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청에 실패했습니다.");
		},
	});

	const { mutate: cancelJoinRequest } = useMutation({
		mutationFn: () =>
			cancelJoinRequestAPI(selectedCenter?.centerJoinRequestId as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			setSelectedCenter({
				centerId: selectedCenter?.centerId as string,
				centerName: selectedCenter?.centerName as string,
				status: "NONE",
				centerJoinRequestId: "",
			});
			toast.success("가입 신청이 취소되었습니다.");
		},
		onError: () => {
			toast.error("가입 신청 취소에 실패했습니다.");
		},
	});

	const handleCenterAction = () => {
		switch (selectedCenter?.status) {
			case "APPLIED":
				cancelJoinRequest();
				break;
			case "NONE":
				registerCenter();
				break;
			case "USER":
				break;
			case "MANAGER":
				break;
			default:
				break;
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);

		if (isNotificationOpen) {
			closeNotificationPanel();
		}
	};

	const handleClickOutside = () => {
		if (isDropdownOpen) {
			setIsDropdownOpen(false);
		}
	};

	const handleCenterChange = () => {
		clearSelectedCenter();
		setIsDropdownOpen(false);
		toast.success("센터를 변경하였습니다.");
	};

	const toggleNotifications = () => {
		toggleNotificationPanel();

		if (isDropdownOpen) {
			setIsDropdownOpen(false);
		}
	};

	const isCenterMember =
		selectedCenter?.status === "USER" ||
		selectedCenter?.status === "MANAGER" ||
		selectedCenter?.status === "MEMBER";

	// 상태별 버튼 텍스트와 스타일
	const getStatusButton = () => {
		if (!selectedCenter?.status) return null;

		const styles: Record<CenterStatus, string> = {
			NONE: "bg-main text-white",
			APPLIED: "bg-red text-white",
			USER: "bg-gray-100 text-gray-500",
			MANAGER: "bg-gray-100 text-gray-500",
		};

		const text: Record<CenterStatus, string> = {
			NONE: "가입 신청",
			APPLIED: "신청 취소",
			USER: "회원",
			MANAGER: "매니저",
		};

		const status = selectedCenter.status as CenterStatus;

		return (
			<button
				type="button"
				onClick={handleCenterAction}
				className={`px-2 py-1 rounded text-xs min-h-[28px] touch-manipulation ${styles[status]}`}
			>
				{text[status]}
			</button>
		);
	};

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
			case "SYSTEM":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	// 드롭다운/알림 패널 외부 클릭 시 닫기 처리
	useEffect(() => {
		const handleGlobalClick = (e: MouseEvent) => {
			if (isNotificationOpen || isDropdownOpen) {
				const target = e.target as HTMLElement;

				// 알림 버튼, 센터 선택 버튼이 아니고 해당 패널에 속하지 않는 경우 닫기
				if (
					!target.closest(".notification-panel") &&
					!target.closest(".notification-button") &&
					!target.closest(".center-dropdown") &&
					!target.closest(".center-dropdown-button")
				) {
					closeNotificationPanel();
					setIsDropdownOpen(false);
				}
			}
		};

		document.addEventListener("mousedown", handleGlobalClick);

		return () => {
			document.removeEventListener("mousedown", handleGlobalClick);
		};
	}, [isNotificationOpen, isDropdownOpen, closeNotificationPanel]);

	// 전체 알림 삭제 처리 함수
	const handleClearAllNotifications = () => {
		clearAllNotifications();
		toast.success("모든 알림이 삭제되었습니다.");
	};

	// 알림 권한 상태 체크 및 UI 표시 설정
	useEffect(() => {
		// 이미 로그인 관련 UI가 표시되었는지 확인 (중복 표시 방지)
		const isAuthFormVisible = document.querySelector(".auth-form-overlay");
		if (isAuthFormVisible) return;

		// 이미 권한 요청을 했는지 확인
		const hasRequestedPermission = localStorage.getItem(
			"notification_permission_requested",
		);

		// 센터가 선택되어 있고 로그인한 상태인 경우에만 권한 관련 UI 표시
		if (selectedCenter?.centerId && user.accessToken) {
			if (permissionStatus === "denied") {
				// 권한이 거부된 경우 가이드 표시 여부 결정
				const hasShownGuide = localStorage.getItem(
					"notification_guide_shown",
				);
				const lastShownTime = localStorage.getItem(
					"notification_guide_timestamp",
				);
				const threeDays = 3 * 24 * 60 * 60 * 1000; // 3일을 밀리초로 계산

				const shouldShowAgain =
					!lastShownTime ||
					Date.now() - Number.parseInt(lastShownTime) > threeDays;

				if (!hasShownGuide || shouldShowAgain) {
					setShowPermissionGuide(true);
					setShowPermissionRequest(false);
				}
			} else if (
				permissionStatus === "default" &&
				!hasRequestedPermission
			) {
				// 권한이 결정되지 않았고, 아직 요청하지 않은 경우 요청 UI 표시
				setShowPermissionRequest(true);
				setShowPermissionGuide(false);
			}
		}
	}, [permissionStatus, selectedCenter?.centerId, user.accessToken]);

	// 가이드 닫기 핸들러
	const handleCloseGuide = () => {
		setShowPermissionGuide(false);
		localStorage.setItem("notification_guide_shown", "true");
		localStorage.setItem(
			"notification_guide_timestamp",
			Date.now().toString(),
		);
	};

	// 권한 요청 닫기 핸들러
	const handleCloseRequest = () => {
		setShowPermissionRequest(false);
		// 요청을 건너뛰었다는 표시
		localStorage.setItem("notification_permission_requested", "true");
	};

	return (
		<>
			<header className="w-full bg-white/95 backdrop-blur-sm shadow-sm z-30 safe-top">
				<div className="flex h-12 items-center px-3 justify-between">
					{/* 로고 영역 - 왼쪽 */}
					<div className="flex items-center">
						<Link to={"/"} className="flex items-center gap-1">
							<img className="w-6 h-6" src={logo} alt="로고" />
							<span className="text-lg font-bold text-main">
								행복하개
							</span>
						</Link>
					</div>

					{/* 오른쪽 영역: 센터 선택기 + 알림 */}
					<div className="flex items-center gap-2">
						{selectedCenter?.centerName && (
							<div className="relative center-dropdown">
								<button
									type="button"
									onClick={toggleDropdown}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											toggleDropdown();
										}
									}}
									className="center-dropdown-button flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
									aria-label="센터 선택"
								>
									<BuildingIcon className="w-3 h-3 text-gray-600" />
									<span className="text-xs font-medium text-gray-700 max-w-[90px] truncate">
										{selectedCenter.centerName}
									</span>
									<IoIosArrowDown
										className={`w-3 h-3 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
									/>
								</button>

								{isDropdownOpen && (
									<div className="absolute top-full right-0 mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-100 w-48 overflow-hidden">
										<div className="p-2.5">
											<p className="text-xs text-gray-400 mb-0.5">
												현재 센터
											</p>
											<p className="text-sm font-medium mb-1 break-words">
												{selectedCenter.centerName}
											</p>
											{user.accessToken &&
												selectedCenter?.centerId &&
												getStatusButton()}
										</div>
										<div className="border-t border-gray-100">
											<button
												type="button"
												className="w-full px-2.5 py-2 flex items-center justify-between text-left text-sm text-main hover:bg-gray-50"
												onClick={handleCenterChange}
												onKeyDown={(e) => {
													if (
														e.key === "Enter" ||
														e.key === " "
													) {
														handleCenterChange();
													}
												}}
											>
												<span>센터 변경하기</span>
												<ChevronRightIcon className="w-3.5 h-3.5" />
											</button>
										</div>
									</div>
								)}
							</div>
						)}

						{/* 알림 버튼은 항상 오른쪽에 배치 */}
						{/* {isCenterMember && ( */}
						<div className="relative">
							<button
								type="button"
								className="notification-button flex items-center justify-center text-gray-600 hover:text-main p-1.5 rounded-full hover:bg-gray-50 touch-manipulation relative"
								aria-label="알림"
								onClick={toggleNotifications}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										toggleNotifications();
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

							{isNotificationOpen && (
								<div className="notification-panel absolute top-full right-0 mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-100 w-[320px] max-h-[400px] overflow-hidden">
									<div className="p-3 border-b border-gray-100 flex items-center justify-between">
										<h3 className="font-medium text-gray-900">
											알림
										</h3>
										<div className="flex items-center gap-2">
											{notifications.length > 0 && (
												<button
													type="button"
													className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
													onClick={
														handleClearAllNotifications
													}
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
											<div className="divide-y divide-gray-100">
												{notifications.map(
													(notification) => (
														<button
															key={
																notification.id
															}
															type="button"
															className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 ${
																notification.isRead
																	? "bg-white"
																	: "bg-blue-50/30"
															}`}
															onClick={() =>
																handleNotificationClick(
																	notification,
																)
															}
														>
															<div
																className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getNotificationBadgeColor(notification.type)}`}
															/>
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-gray-900 text-sm">
																	{
																		notification.title
																	}
																</h4>
																<p className="text-gray-600 text-xs mt-1 line-clamp-2">
																	{
																		notification.body
																	}
																</p>
																<span className="text-xs text-gray-400 mt-1 block">
																	{formatNotificationTime(
																		notification.createdAt,
																	)}
																</span>
															</div>
														</button>
													),
												)}
											</div>
										)}
									</div>
								</div>
							)}
						</div>
						{/* )} */}
					</div>
				</div>
			</header>

			{/* 알림 권한 관련 UI */}
			{showPermissionGuide && (
				<NotificationPermissionGuide onClose={handleCloseGuide} />
			)}

			{showPermissionRequest && (
				<NotificationRequestPrompt onClose={handleCloseRequest} />
			)}
		</>
	);
}

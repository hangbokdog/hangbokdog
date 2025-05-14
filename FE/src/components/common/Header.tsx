import logo from "@/assets/logo.png";
import { IoIosArrowDown } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { BuildingIcon, ChevronRightIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/lib/store/authStore";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelJoinRequestAPI, registerCenterAPI } from "@/api/center";
import { useState } from "react";

type CenterStatus = "NONE" | "APPLIED" | "USER" | "MANAGER";

export default function Header() {
	const { user } = useAuthStore();
	const { selectedCenter, clearSelectedCenter, setSelectedCenter } =
		useCenterStore();
	const queryClient = useQueryClient();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const navigate = useNavigate();

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
				navigate("/manager");
				break;
			default:
				break;
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
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

	const isCenterMember =
		selectedCenter?.status === "USER" ||
		selectedCenter?.status === "MANAGER";

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

	return (
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
						<div className="relative">
							<button
								type="button"
								onClick={toggleDropdown}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										toggleDropdown();
									}
								}}
								className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
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
								<>
									<div
										className="fixed inset-0 z-10"
										onClick={handleClickOutside}
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												handleClickOutside();
											}
										}}
										role="button"
										tabIndex={-1}
										aria-label="드롭다운 닫기"
									/>
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
								</>
							)}
						</div>
					)}

					{/* 알림 버튼은 항상 오른쪽에 배치 */}
					{isCenterMember && (
						<button
							type="button"
							className="flex items-center justify-center text-gray-600 hover:text-main p-1.5 rounded-full hover:bg-gray-50 touch-manipulation"
							aria-label="알림"
							onClick={() => {
								/* Handle notification click */
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									// Handle notification click
								}
							}}
						>
							<IoNotificationsOutline className="w-5 h-5" />
						</button>
					)}
				</div>
			</div>
		</header>
	);
}

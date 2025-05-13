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
				// TODO: 신청 취소 API 호출
				cancelJoinRequest();
				break;
			case "NONE":
				// TODO: 가입 신청 API 호출
				registerCenter();
				break;
			case "USER":
				// TODO: 센터 변경 API 호출
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
				<div className="relative z-20">
					<button
						type="button"
						className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
						onClick={toggleDropdown}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								toggleDropdown();
							}
						}}
					>
						<BuildingIcon className="w-3.5 h-3.5 text-gray-500" />
						<span className="text-sm font-medium truncate max-w-[110px]">
							{selectedCenter.centerName}
						</span>
						<IoIosArrowDown
							className={`size-3.5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
						/>
					</button>
					{isDropdownOpen && (
						<>
							<div
								className="fixed inset-0 z-10"
								onClick={handleClickOutside}
								role="button"
								tabIndex={-1}
								aria-label="Close dropdown"
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										handleClickOutside();
									}
								}}
							/>
							<div className="absolute top-full mt-1 right-0 z-20 bg-white shadow-lg rounded-lg overflow-hidden w-48 border border-gray-100">
								<div className="py-2 px-3">
									<p className="text-xs text-gray-400 mb-1">
										현재 센터
									</p>
									<p className="text-sm font-medium text-gray-800 truncate">
										{selectedCenter.centerName}
									</p>
								</div>
								<div className="border-t border-gray-100">
									<button
										type="button"
										className="w-full px-3 py-2.5 flex items-center justify-between text-left text-sm text-main hover:bg-gray-50 transition-colors duration-200"
										onClick={handleCenterChange}
									>
										<span>센터 변경하기</span>
										<ChevronRightIcon className="w-4 h-4" />
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			)}
			<div className="flex items-center gap-3">
				{user.accessToken && selectedCenter?.centerId && (
					<button
						type="button"
						onClick={handleCenterAction}
						className={`px-3 py-1 rounded text-sm 
							${selectedCenter.status === "NONE" && "bg-main text-white"} 
							${selectedCenter.status === "APPLIED" && "bg-red text-white"}
							${selectedCenter.status === "USER" && "bg-gray-100 text-gray-500"}
							${selectedCenter.status === "MANAGER" && "bg-gray-100 text-gray-500"}
						`}
					>
						{selectedCenter.status === "APPLIED" && "신청 취소하기"}
						{selectedCenter.status === "USER" && "회원"}
						{selectedCenter.status === "MANAGER" && "매니저"}
						{selectedCenter.status === "NONE" && "가입 신청하기"}
					</button>
				)}
				{isCenterMember && (
					<button
						type="button"
						className="text-grayText hover:text-main"
						onClick={() => {
							/* Handle notification click */
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								// Handle notification click
							}
						}}
						aria-label="알림"
					>
						<IoNotificationsOutline className="size-6" />
					</button>
				)}
			</div>
		</header>
	);
}

import {
	addMainCenterIdAPI,
	type AddressBook,
	cancelJoinRequestAPI,
	fetchAddressBooks,
	registerCenterAPI,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
	BuildingIcon,
	LogInIcon,
	XIcon,
	UserPlusIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface CenterDecisionListItemProps {
	centerId: string;
	centerName: string;
	status: string;
	index: number;
	query?: string;
	centerJoinRequestId?: string;
}

export default function CenterDecisionListItem({
	centerId,
	centerName,
	status,
	query,
	centerJoinRequestId,
}: CenterDecisionListItemProps) {
	const { setSelectedCenter, setIsCenterMember, myMainCenterId } =
		useCenterStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isExpanded, setIsExpanded] = useState(false);
	const isLongName = centerName ? centerName.length > 12 : false;

	const { refetch } = useQuery<AddressBook[], Error>({
		queryKey: ["addressBooks", centerId],
		queryFn: () => fetchAddressBooks(centerId),
		enabled: false,
	});

	const { mutate: addMainCenterId } = useMutation({
		mutationFn: () => addMainCenterIdAPI(centerId),
	});

	const { mutate: registerCenter, isPending: isRegistering } = useMutation({
		mutationFn: () => registerCenterAPI(centerId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerSearch", query],
			});
			queryClient.invalidateQueries({
				queryKey: ["myCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["searchCenterCities"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerCities"],
			});
			toast.success("가입 신청이 완료되었습니다");
		},
		onError: () => {
			toast.error("가입 신청에 실패했습니다");
		},
	});

	const { mutate: cancelJoinRequest, isPending: isCancelling } = useMutation({
		mutationFn: () => cancelJoinRequestAPI(centerJoinRequestId as string),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["myJoinRequestCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerSearch", query],
			});
			queryClient.invalidateQueries({
				queryKey: ["myCenters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["searchCenterCities"],
			});
			queryClient.invalidateQueries({
				queryKey: ["centerCities"],
			});
			toast.success("가입 신청이 취소되었습니다");
		},
		onError: () => {
			toast.error("가입 신청 취소에 실패했습니다");
		},
	});

	const handleRegister = () => {
		registerCenter();
	};

	const handleCancel = () => {
		cancelJoinRequest();
	};

	const handleVisit = async () => {
		setSelectedCenter({
			centerId,
			centerName,
			status,
			centerJoinRequestId,
		});

		const { data } = await refetch();

		if (status === "MANAGER" || status === "USER" || status === "MEMBER") {
			setIsCenterMember(true);
		} else {
			setIsCenterMember(false);
		}

		if (centerId !== myMainCenterId) {
			addMainCenterId();
		}
		navigate("/");
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	// 상태에 따른 배지 색상 및 텍스트
	const getBadgeInfo = () => {
		switch (status) {
			case "MANAGER":
				return { color: "bg-green-100 text-green-600", text: "매니저" };
			case "USER":
				return { color: "bg-blue-100 text-blue-600", text: "회원" };
			case "APPLIED":
				return {
					color: "bg-amber-100 text-amber-600",
					text: "승인 대기중",
				};
			default:
				return { color: "bg-gray-100 text-gray-600", text: "" };
		}
	};

	const badge = getBadgeInfo();
	const isMember = status === "MANAGER" || status === "USER";

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			whileTap={{ scale: 0.98 }}
			className={`mb-2.5 bg-white rounded-xl shadow-sm border ${
				status === "APPLIED" ? "border-amber-200" : "border-gray-100"
			} ${isMember ? "border-l-4 border-l-blue-500" : ""}`}
		>
			<div className="p-4 flex flex-col gap-3">
				<div className="flex items-center">
					<div
						className={`p-2.5 rounded-full mr-3 ${
							status === "MANAGER"
								? "bg-green-50"
								: status === "USER"
									? "bg-blue-50"
									: status === "APPLIED"
										? "bg-amber-50"
										: "bg-gray-50"
						}`}
					>
						<BuildingIcon
							className={`size-5 ${
								status === "MANAGER"
									? "text-green-500"
									: status === "USER"
										? "text-blue-500"
										: status === "APPLIED"
											? "text-amber-500"
											: "text-gray-500"
							}`}
						/>
					</div>
					<div className="flex items-center">
						<div className="flex-1">
							<div className="flex items-center gap-1">
								<h3
									className={`font-medium text-gray-900 ${isLongName && !isExpanded ? "line-clamp-1" : ""}`}
								>
									{centerName}
								</h3>
								{isLongName && (
									<button
										type="button"
										onClick={toggleExpand}
										className="ml-0.5 p-0.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
									>
										{isExpanded ? (
											<ChevronUpIcon className="size-4 text-gray-500" />
										) : (
											<ChevronDownIcon className="size-4 text-gray-500" />
										)}
									</button>
								)}
							</div>
							{badge.text && (
								<span
									className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${badge.color}`}
								>
									{badge.text}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-2 justify-end">
					{status === "NONE" && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className="flex items-center justify-center gap-1.5 bg-blue-500 text-white rounded-full px-3.5 py-2 text-sm font-medium shadow-sm hover:bg-blue-600 transition-colors"
							onClick={handleRegister}
							disabled={isRegistering}
						>
							<UserPlusIcon className="size-4" />
							<span className="truncate">가입 신청</span>
							{isRegistering && (
								<span className="ml-1 h-3.5 w-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
							)}
						</motion.button>
					)}
					{status === "APPLIED" && (
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className="flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-full px-3.5 py-2 text-sm font-medium shadow-sm hover:bg-red-600 transition-colors"
							onClick={handleCancel}
							disabled={isCancelling}
						>
							<XIcon className="size-4" />
							<span className="truncate">신청 취소</span>
							{isCancelling && (
								<span className="ml-1 h-3.5 w-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
							)}
						</motion.button>
					)}
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type="button"
						className={`flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium shadow-sm transition-colors ${
							isMember
								? "bg-blue-500 hover:bg-blue-600 text-white"
								: "bg-gray-100 hover:bg-gray-200 text-gray-700"
						}`}
						onClick={handleVisit}
					>
						<LogInIcon className="size-4" />
						<span className="truncate">방문하기</span>
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}

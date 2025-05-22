import {
	type AddressBookRequest,
	createAddressBookAPI,
	deleteAddressBookAPI,
	fetchAddressBooks,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationLabel } from "@/types/center";
import { toast } from "sonner";
import {
	MdEditNote,
	MdLocationOn,
	MdDelete,
	MdSearch,
	MdArrowBack,
	MdCheck,
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaRegBuilding } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// 지역 배지 색상 정의
const getAddressColor = (address: string) => {
	switch (address) {
		case "SEOUL":
			return "bg-blue-100 text-blue-600";
		case "DAEJEON":
			return "bg-green-100 text-green-600";
		case "BUSAN":
			return "bg-yellow-100 text-yellow-600";
		case "INCHEON":
			return "bg-purple-100 text-purple-600";
		case "GWANGJU":
			return "bg-indigo-100 text-indigo-600";
		case "DAEGU":
			return "bg-pink-100 text-pink-600";
		case "ULSAN":
			return "bg-orange-100 text-orange-600";
		case "SEJONG":
			return "bg-teal-100 text-teal-600";
		case "JEJU":
			return "bg-cyan-100 text-cyan-600";
		case "GYEONGGI":
			return "bg-red-100 text-red-600";
		case "GANGWON":
			return "bg-lime-100 text-lime-600";
		case "CHUNGBUK":
			return "bg-amber-100 text-amber-600";
		case "CHUNGNAM":
			return "bg-emerald-100 text-emerald-600";
		case "JEONBUK":
			return "bg-violet-100 text-violet-600";
		case "JEONNAM":
			return "bg-fuchsia-100 text-fuchsia-600";
		case "GYEONGBUK":
			return "bg-rose-100 text-rose-600";
		case "GYEONGNAM":
			return "bg-sky-100 text-sky-600";
		case "GEOJE":
			return "bg-blue-100 text-blue-600";
		case "OSAN":
			return "bg-purple-100 text-purple-600";
		default:
			return "bg-gray-100 text-gray-600";
	}
};

// 한글 초성 배열
const KOREAN_CONSONANTS = [
	"ㄱ",
	"ㄲ",
	"ㄴ",
	"ㄷ",
	"ㄸ",
	"ㄹ",
	"ㅁ",
	"ㅂ",
	"ㅃ",
	"ㅅ",
	"ㅆ",
	"ㅇ",
	"ㅈ",
	"ㅉ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ",
];

// 한글 자음 그룹 (표시용)
const CONSONANT_GROUPS = [
	"ㄱ",
	"ㄴ",
	"ㄷ",
	"ㄹ",
	"ㅁ",
	"ㅂ",
	"ㅅ",
	"ㅇ",
	"ㅈ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ",
];

// 초성 추출 함수
const getConsonant = (str: string): string => {
	if (!str) return "ㅎ"; // 기본값

	const firstChar = str.charAt(0);

	// 한글인지 확인
	if (/[가-힣]/.test(firstChar)) {
		// 한글 유니코드 계산
		const code = firstChar.charCodeAt(0) - 44032;
		// 초성 추출
		const consonantIndex = Math.floor(code / 588);
		const consonant = KOREAN_CONSONANTS[consonantIndex];

		// 쌍자음인 경우 기본 자음으로 매핑
		if (consonant === "ㄲ") return "ㄱ";
		if (consonant === "ㄸ") return "ㄷ";
		if (consonant === "ㅃ") return "ㅂ";
		if (consonant === "ㅆ") return "ㅅ";
		if (consonant === "ㅉ") return "ㅈ";

		return consonant;
	}

	// 한글이 아닌 경우 기타로 분류
	return "ㅎ";
};

// 지역을 초성으로 그룹화하는 함수
const groupLocationsByConsonant = (
	locations: { key: string; label: string }[],
): [string, { key: string; label: string }[]][] => {
	// 자음별 그룹 초기화
	const groups: Record<string, { key: string; label: string }[]> = {};

	// 각 자음 그룹 초기화
	for (const consonant of CONSONANT_GROUPS) {
		groups[consonant] = [];
	}

	// 각 지역을 해당 초성 그룹에 추가
	for (const location of locations) {
		const consonant = getConsonant(location.label);
		groups[consonant].push(location);
	}

	// 빈 그룹 제거 후 배열로 변환
	return CONSONANT_GROUPS.filter(
		(consonant) => groups[consonant].length > 0,
	).map((consonant) => [consonant, groups[consonant]]);
};

export default function AddressBookPanel() {
	const { selectedCenter } = useCenterStore();
	const [formData, setFormData] = useState<AddressBookRequest>({
		address: "",
		addressName: "",
	});
	const [open, setOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [currentAddress, setCurrentAddress] = useState<{
		id: number;
		addressName: string;
		address: string;
	} | null>(null);

	// 지역 선택 모달 상태
	const [locationModalOpen, setLocationModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [recentLocations, setRecentLocations] = useState<string[]>([]);

	// API로 주소록 데이터 가져오기
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["addressBooks", selectedCenter?.centerId],
		queryFn: () => fetchAddressBooks(selectedCenter?.centerId as string),
	});

	// 검색어에 따라 필터링된 지역 목록
	const filteredLocations = useMemo(() => {
		const locations = Object.entries(LocationLabel).map(([key, label]) => ({
			key,
			label,
		}));

		if (!searchTerm) return locations;

		return locations.filter((location) =>
			location.label.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [searchTerm]);

	// 지역을 그룹화 (한글 자음별로)
	const groupedLocations = useMemo(() => {
		return groupLocationsByConsonant(filteredLocations);
	}, [filteredLocations]);

	// 최근 선택한 지역 로컬 스토리지에서 로드
	useEffect(() => {
		const saved = localStorage.getItem("recentLocations");
		if (saved) {
			try {
				setRecentLocations(JSON.parse(saved));
			} catch (e) {
				console.error("최근 지역 데이터 로드 실패", e);
			}
		}
	}, []);

	// 최근 선택한 지역 저장
	const saveRecentLocation = (locationKey: string) => {
		const updatedRecent = [
			locationKey,
			...recentLocations.filter((key) => key !== locationKey),
		].slice(0, 5); // 최근 5개만 유지

		setRecentLocations(updatedRecent);
		localStorage.setItem("recentLocations", JSON.stringify(updatedRecent));
	};

	const handleCreateButtonClick = () => {
		setOpen(true);
	};

	const handleInputCancel = () => {
		setOpen(false);
		setFormData({
			address: "",
			addressName: "",
		});
	};

	const { mutate: registerCenter, isPending: isRegistering } = useMutation({
		mutationFn: () =>
			createAddressBookAPI(selectedCenter?.centerId || "", formData),
		onSuccess: () => {
			refetch();
			setFormData({
				address: "",
				addressName: "",
			});
			setOpen(false);
			toast.success("새 지역이 추가되었습니다");
		},
		onError: (e) => {
			console.error(e);
			toast.error("지역 추가에 실패했습니다");
		},
	});

	const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
		mutationFn: (id: number) =>
			deleteAddressBookAPI(selectedCenter?.centerId || "", id.toString()),
		onSuccess: () => {
			refetch();
			setEditDialogOpen(false);
			setCurrentAddress(null);
			toast.success("지역이 삭제되었습니다");
		},
		onError: () => {
			toast.error("지역 삭제에 실패했습니다");
		},
	});

	const handleSubmit = () => {
		if (formData.addressName === "" || formData.address === "") {
			toast.error("지역명과 주소를 모두 입력해주세요");
			return;
		}

		registerCenter();
	};

	const handleEditClick = (address: {
		id: number;
		addressName: string;
		address: string;
	}) => {
		setCurrentAddress(address);
		setEditDialogOpen(true);
	};

	const handleDeleteAddress = () => {
		if (currentAddress) {
			deleteAddress(currentAddress.id);
		}
	};

	const openLocationModal = () => {
		setSearchTerm("");
		setLocationModalOpen(true);
	};

	const handleLocationSelect = (key: string, label: string) => {
		setFormData((prev) => ({
			...prev,
			address: key,
		}));
		saveRecentLocation(key);
		setLocationModalOpen(false);
	};

	// 키보드 액세스 핸들러
	const handleLocationKeyPress = (
		event: React.KeyboardEvent,
		key: string,
		label: string,
	) => {
		if (event.key === "Enter" || event.key === " ") {
			handleLocationSelect(key, label);
		}
	};

	// 지역 선택 영역 키보드 접근성
	const handleAddressFieldKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			openLocationModal();
		}
	};

	return (
		<div className="flex flex-col bg-white rounded-xl shadow-md p-4 text-gray-800">
			{/* 헤더 영역 */}
			<div className="flex items-center justify-between mb-5">
				<div>
					<h2 className="text-lg font-bold flex items-center">
						<MdLocationOn className="text-primary mr-1" size={20} />
						관리 지역
					</h2>
					<p className="text-xs text-gray-500 mt-0.5">
						{data?.length || 0}개의 지역을 관리하고 있습니다
					</p>
				</div>

				<Button
					size="sm"
					onClick={handleCreateButtonClick}
					className="rounded-full bg-primary hover:bg-primary/90 text-white px-3"
				>
					<IoMdAdd size={18} className="mr-1" />
					지역 추가
				</Button>
			</div>

			{/* 로딩 상태 */}
			{isLoading && (
				<div className="flex justify-center items-center py-10">
					{/* biome-ignore lint/style/useSelfClosingElements: 스켈레톤 */}
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			)}

			{/* 데이터가 없을 때 */}
			{!isLoading && (!data || data.length === 0) && (
				<div className="py-10 flex flex-col items-center justify-center text-center">
					<FaRegBuilding size={40} className="text-gray-300 mb-3" />
					<p className="text-gray-500 mb-1">
						아직 등록된 지역이 없습니다
					</p>
					<p className="text-xs text-gray-400">
						우측 상단의 지역 추가 버튼을 눌러 새 지역을 추가해보세요
					</p>
				</div>
			)}

			{/* 주소 목록 */}
			<AnimatePresence>
				<div className="grid grid-cols-1 gap-3">
					{data?.map((address) => (
						<motion.div
							key={address.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow"
						>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-semibold text-lg">
										{address.addressName}
									</h3>
									<div className="flex items-center mt-1">
										<span
											className={`text-xs px-2 py-0.5 rounded-full ${getAddressColor(address.address)}`}
										>
											{LocationLabel[
												address.address as keyof typeof LocationLabel
											] || address.address}
										</span>
										{/* 
										{address.appliedCount &&
											address.appliedCount > 0 && (
												<span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
													신청자{" "}
													{address.appliedCount}명
												</span>
											)} */}
									</div>
								</div>

								<button
									type="button"
									className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
									onClick={() => handleEditClick(address)}
								>
									<MdEditNote size={20} />
								</button>
							</div>

							<div className="mt-3 flex justify-end">
								<Link
									to="/manager/volunteer"
									className="text-xs font-medium text-primary flex items-center"
								>
									봉사 일정 관리하기
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</AnimatePresence>

			{/* 추가 드로어 */}
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent className="max-h-[85vh]">
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader>
							<DrawerTitle className="flex items-center text-lg">
								<IoMdAdd
									className="mr-1 text-primary"
									size={20}
								/>
								새 지역 추가
							</DrawerTitle>
						</DrawerHeader>
						<div className="p-4 pb-0 space-y-4">
							<div>
								<label
									htmlFor="addressName"
									className="text-xs font-medium text-gray-500 mb-1 block"
								>
									지역명
								</label>
								<Input
									id="addressName"
									placeholder="예: 쉼터, 쉼뜰"
									value={formData.addressName}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											addressName: e.target.value,
										}))
									}
									className="border-gray-300 focus:border-primary"
								/>
							</div>

							<div>
								<label
									htmlFor="address"
									className="text-xs font-medium text-gray-500 mb-1 block"
								>
									주소
								</label>
								<div
									// biome-ignore lint/a11y/useSemanticElements: 버튼 역할 유지
									role="button"
									tabIndex={0}
									onClick={openLocationModal}
									onKeyDown={handleAddressFieldKeyDown}
									className="flex items-center justify-between p-2.5 border border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors"
								>
									<span
										className={
											formData.address
												? "text-black"
												: "text-gray-500"
										}
									>
										{formData.address
											? LocationLabel[
													formData.address as keyof typeof LocationLabel
												]
											: "지역을 선택하세요"}
									</span>
									<MdLocationOn
										className="text-gray-400"
										size={20}
									/>
								</div>
							</div>
						</div>
						<DrawerFooter className="mt-6">
							<Button
								onClick={handleSubmit}
								className="bg-primary hover:bg-primary/90"
								disabled={isRegistering}
							>
								{isRegistering ? "추가 중..." : "추가하기"}
							</Button>
							<Button
								variant="outline"
								onClick={handleInputCancel}
							>
								취소
							</Button>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>

			{/* 지역 선택 모달 */}
			<Dialog
				open={locationModalOpen}
				onOpenChange={setLocationModalOpen}
			>
				<DialogContent className="sm:max-w-[400px] p-0 h-[85vh] max-h-[600px] overflow-hidden flex flex-col">
					<DialogHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
						<div className="flex items-center space-x-2">
							<button
								type="button"
								onClick={() => setLocationModalOpen(false)}
								className="p-1.5 rounded-full hover:bg-gray-100"
							>
								<MdArrowBack size={20} />
							</button>
							<DialogTitle className="flex-1">
								지역 선택
							</DialogTitle>
						</div>
						<div className="mt-2 relative">
							<Input
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="지역명 검색"
								className="pl-9 py-2 w-full border-gray-300 focus:border-primary"
							/>
							<MdSearch
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={20}
							/>
							{searchTerm && (
								<button
									type="button"
									onClick={() => setSearchTerm("")}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 p-1 rounded-full hover:bg-gray-100"
								>
									✕
								</button>
							)}
						</div>
					</DialogHeader>

					<div className="flex-1 overflow-y-auto px-1">
						{/* 검색 결과가 없을 때 */}
						{filteredLocations.length === 0 && (
							<div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
								<p>검색 결과가 없습니다</p>
								<p className="text-sm mt-1">
									다른 검색어를 입력해보세요
								</p>
							</div>
						)}

						{/* 최근 선택한 지역 표시 */}
						{!searchTerm && recentLocations.length > 0 && (
							<div className="mb-4 px-3">
								<h3 className="text-xs font-medium text-gray-500 mb-2 mt-3">
									최근 선택
								</h3>
								<div className="space-y-1">
									{recentLocations.map((locationKey) => {
										const locationLabel =
											LocationLabel[
												locationKey as keyof typeof LocationLabel
											];
										if (!locationLabel) return null;

										return (
											<button
												type="button"
												key={locationKey}
												onClick={() =>
													handleLocationSelect(
														locationKey,
														locationLabel,
													)
												}
												className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 
													${formData.address === locationKey ? "bg-primary/5 text-primary" : ""}`}
											>
												<div className="flex items-center">
													{/* biome-ignore lint/style/useSelfClosingElements:	 */}
													<span
														className={`w-2 h-2 rounded-full mr-2 ${getAddressColor(locationKey)}`}
													></span>
													<span>{locationLabel}</span>
												</div>
												{formData.address ===
													locationKey && (
													<MdCheck
														className="text-primary"
														size={20}
													/>
												)}
											</button>
										);
									})}
								</div>
							</div>
						)}

						{/* 그룹화된 지역 목록 */}
						{groupedLocations.map(([group, locations]) => (
							<div key={group} className="mb-2 px-3">
								<h3 className="text-xs font-medium text-gray-500 sticky top-0 bg-gray-50 px-2 py-1 rounded mb-1 mt-2">
									{group}
								</h3>
								<div className="space-y-1">
									{locations.map(({ key, label }) => (
										<button
											type="button"
											key={key}
											onClick={() =>
												handleLocationSelect(key, label)
											}
											onKeyDown={(e) =>
												handleLocationKeyPress(
													e,
													key,
													label,
												)
											}
											className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors
												${formData.address === key ? "bg-primary/5 text-primary" : ""}`}
										>
											<div className="flex items-center">
												<span
													className={`w-2 h-2 rounded-full mr-2 ${getAddressColor(key)}`}
												/>
												<span>{label}</span>
											</div>
											{formData.address === key && (
												<MdCheck
													className="text-primary"
													size={20}
												/>
											)}
										</button>
									))}
								</div>
							</div>
						))}

						{/* 하단 여백 */}
						{/* biome-ignore lint/style/useSelfClosingElements: 스켈레톤 */}
						<div className="h-4"></div>
					</div>
				</DialogContent>
			</Dialog>

			{/* 수정/삭제 다이얼로그 */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="sm:max-w-[400px]">
					<DialogHeader>
						<DialogTitle className="flex items-center">
							<MdEditNote
								className="mr-1 text-primary"
								size={20}
							/>
							지역 정보 관리
						</DialogTitle>
					</DialogHeader>

					{currentAddress && (
						<div className="py-4">
							<h3 className="font-semibold text-lg">
								{currentAddress.addressName}
							</h3>
							<p className="text-sm text-gray-600">
								{LocationLabel[
									currentAddress.address as keyof typeof LocationLabel
								] || currentAddress.address}
							</p>

							<div className="mt-6 space-y-2">
								<Link
									to="/manager/volunteer"
									className="flex items-center justify-center w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
								>
									봉사 일정 관리
								</Link>

								<Button
									variant="destructive"
									className="w-full"
									onClick={handleDeleteAddress}
									disabled={isDeleting}
								>
									<MdDelete className="mr-1" size={16} />
									{isDeleting
										? "삭제 중..."
										: "지역 삭제하기"}
								</Button>
							</div>
						</div>
					)}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditDialogOpen(false)}
						>
							닫기
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

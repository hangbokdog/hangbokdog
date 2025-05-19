import {
	type AddressBookRequest,
	createAddressBookAPI,
	deleteAddressBookAPI,
	fetchAddressBooks,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LocationLabel } from "@/types/center";
import { toast } from "sonner";
import { MdEditNote, MdLocationOn, MdDelete } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
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

	// API로 주소록 데이터 가져오기
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["addressBooks", selectedCenter?.centerId],
		queryFn: () => fetchAddressBooks(selectedCenter?.centerId as string),
	});

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
								<Select
									value={formData.address}
									onValueChange={(value) =>
										setFormData((prev) => ({
											...prev,
											address: value,
										}))
									}
								>
									<SelectTrigger
										id="address"
										className="w-full border-gray-300 focus:border-primary"
									>
										<SelectValue placeholder="지역을 선택하세요" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(LocationLabel).map(
											([key, label]) => (
												<SelectItem
													key={key}
													value={key}
												>
													{label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
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

import {
	type AddressBookRequest,
	createAddressBookAPI,
	fetchAddressBooks,
} from "@/api/center";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import AddressBookListItem from "./AddressBookListItem";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
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
import { IoIosSearch } from "react-icons/io";
import { FaLocationDot, FaHouse } from "react-icons/fa6";
import { MdPets } from "react-icons/md";

// 지역 정보 타입 정의
interface Location {
	id: string;
	name: string;
	address: string;
	type: "보호소" | "입양처" | "협력병원";
	distance: number; // km 단위
	dogCount?: number; // 보호소의 경우 강아지 수
}

// 더미 지역 데이터
const dummyLocations: Location[] = [
	{
		id: "1",
		name: "해피 보호소",
		address: "서울특별시 강남구 테헤란로 123",
		type: "보호소",
		distance: 0.5,
		dogCount: 12,
	},
	{
		id: "2",
		name: "김민준 님",
		address: "서울특별시 서초구 서초대로 78길 42",
		type: "입양처",
		distance: 2.3,
	},
	{
		id: "3",
		name: "24시 동물병원",
		address: "서울특별시 강남구 강남대로 456",
		type: "협력병원",
		distance: 1.1,
	},
	{
		id: "4",
		name: "이서연 님",
		address: "서울특별시 송파구 올림픽로 123",
		type: "입양처",
		distance: 4.7,
	},
	{
		id: "5",
		name: "사랑 보호소",
		address: "서울특별시 마포구 월드컵로 42길 15",
		type: "보호소",
		distance: 5.8,
		dogCount: 8,
	},
	{
		id: "6",
		name: "동물메디컬센터",
		address: "서울특별시 강남구 언주로 725",
		type: "협력병원",
		distance: 3.2,
	},
];

export default function AddressBookPanel() {
	const { selectedCenter } = useCenterStore();
	const [formData, setFormData] = useState<AddressBookRequest>({
		address: "",
		addressName: "",
	});
	const [open, setOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [filter, setFilter] = useState<
		"전체" | "보호소" | "입양처" | "협력병원"
	>("전체");

	const { refetch, data } = useQuery({
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

	const { mutate: registerCenter } = useMutation({
		mutationFn: () =>
			createAddressBookAPI(selectedCenter?.centerId || "", formData),
		onSuccess: () => {
			refetch();
			setFormData((prev) => ({
				...prev,
				addressName: "",
			}));
			setOpen(false);
		},
		onError: (e) => {
			console.error(e);
			toast.error("생성에 실패했습니다.");
		},
	});

	const handleSubmit = () => {
		if (formData.addressName === "" || formData.address === "") {
			toast.error("주소와 지역명을 입력해주세요.");
			return;
		}

		registerCenter();
	};

	// 검색 및 필터링
	const filteredLocations = dummyLocations
		.filter(
			(location) =>
				(filter === "전체" || location.type === filter) &&
				(location.name.includes(searchText) ||
					location.address.includes(searchText)),
		)
		.sort((a, b) => a.distance - b.distance);

	// 장소 유형별 아이콘과 색상
	const getTypeIcon = (type: Location["type"]) => {
		switch (type) {
			case "보호소":
				return <MdPets className="text-blue-600" />;
			case "입양처":
				return <FaHouse className="text-green-600" />;
			case "협력병원":
				return <FaLocationDot className="text-amber-600" />;
		}
	};

	const getTypeColor = (type: Location["type"]) => {
		switch (type) {
			case "보호소":
				return "bg-blue-50 text-blue-700";
			case "입양처":
				return "bg-green-50 text-green-700";
			case "협력병원":
				return "bg-amber-50 text-amber-700";
		}
	};

	return (
		<div className="flex flex-col bg-white rounded-lg shadow-custom-sm p-4 text-grayText font-semibold gap-2">
			<span className="text-lg font-bold">지역</span>

			<div className="flex flex-col">
				<button
					type="button"
					onClick={handleCreateButtonClick}
					className="flex items-center justify-center rounded-full px-4 py-2.5 font-medium bg-superLightBlueGray hover:shadow-[inset_0_0_8px_rgba(194,209,252,1)] transition-shadow duration-300 cursor-pointer"
				>
					<FaPlusCircle />
				</button>

				<Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
					<DrawerContent>
						<div className="mx-auto w-full max-w-sm">
							<DrawerHeader>
								<DrawerTitle>새 주소 추가</DrawerTitle>
							</DrawerHeader>
							<div className="p-4 pb-0 space-y-4">
								<Input
									placeholder="지역명"
									defaultValue={formData.addressName}
									onBlur={(e) => {
										setFormData((prev) => ({
											...prev,
											addressName: e.target.value,
										}));
									}}
								/>

								<Select
									value={formData.address}
									onValueChange={(value) =>
										setFormData((prev) => ({
											...prev,
											address: value,
										}))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="지역을 선택하세요" />
									</SelectTrigger>
									<SelectContent aria-modal={false}>
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
							<DrawerFooter>
								<Button onClick={handleSubmit}>추가</Button>
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

				{data?.map((center, index) => (
					<AddressBookListItem
						key={center.id}
						id={center.id}
						centerId={selectedCenter?.centerId as string}
						address={center.address}
						addressName={center.addressName}
						index={index + 1}
						onUpdate={() => {
							refetch();
						}}
					/>
				))}
			</div>

			<div className="mt-4">
				<h2 className="text-lg font-bold text-gray-800">
					{selectedCenter?.centerName || "센터"} 지역 정보
				</h2>
				<p className="text-sm text-gray-500">
					주변 보호소, 입양처, 협력 병원 정보를 확인하세요
				</p>
			</div>

			{/* 검색 및 필터 영역 */}
			<div className="mb-4">
				<div className="relative mb-3">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<IoIosSearch className="text-gray-400" size={18} />
					</div>
					<input
						type="text"
						className="bg-white w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-main"
						placeholder="장소 이름 또는 주소 검색..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
				</div>

				{/* 필터 버튼 */}
				<div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
					{(["전체", "보호소", "입양처", "협력병원"] as const).map(
						(type) => (
							<button
								key={type}
								type="button"
								className={`px-3 py-1.5 rounded-full text-sm font-medium min-w-fit ${
									filter === type
										? "bg-main text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
								onClick={() => setFilter(type)}
							>
								{type}
							</button>
						),
					)}
				</div>
			</div>

			{/* 위치 목록 */}
			<div className="space-y-3">
				{filteredLocations.length === 0 ? (
					<p className="text-center py-4 text-gray-400 bg-white rounded-lg shadow-sm">
						검색 결과가 없습니다.
					</p>
				) : (
					filteredLocations.map((location) => (
						<div
							key={location.id}
							className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
						>
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h3 className="font-medium text-gray-800">
											{location.name}
										</h3>
										<span
											className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(location.type)}`}
										>
											{location.type}
										</span>
									</div>

									<p className="text-sm text-gray-500 mt-1">
										{location.address}
									</p>

									{location.dogCount !== undefined && (
										<p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
											<MdPets size={14} />
											<span>
												보호 중인 아이들:{" "}
												{location.dogCount}마리
											</span>
										</p>
									)}
								</div>

								<div className="flex flex-col items-end">
									<span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
										{location.distance} km
									</span>

									<button
										type="button"
										className="mt-2 text-xs text-main font-medium"
									>
										지도 보기
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

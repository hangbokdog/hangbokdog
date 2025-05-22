import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

interface BazaarItem {
	id: number;
	title: string;
	price: number;
	imageUrl: string;
	status: "available" | "reserved" | "sold";
	createdAt: string;
	center: string;
}

export default function BazaarPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");
	const [items, setItems] = useState<BazaarItem[]>([]);

	// 임시 데이터 (실제로는 API에서 가져올 예정)
	useEffect(() => {
		// 실제 구현에서는 API 호출로 대체
		const mockItems: BazaarItem[] = [
			{
				id: 1,
				title: "강아지 장난감 세트",
				price: 15000,
				imageUrl:
					"https://images.unsplash.com/photo-1581467655410-0e2f7bf4e83d",
				status: "available",
				createdAt: "2023-08-15",
				center: "행복한 강아지 센터",
			},
			{
				id: 2,
				title: "개집 (소형견용)",
				price: 35000,
				imageUrl:
					"https://images.unsplash.com/photo-1591946614720-90a587da4a36",
				status: "available",
				createdAt: "2023-08-14",
				center: "사랑이 넘치는 보호소",
			},
			{
				id: 3,
				title: "강아지 목줄 (미사용)",
				price: 8000,
				imageUrl:
					"https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5",
				status: "reserved",
				createdAt: "2023-08-13",
				center: "행복한 강아지 센터",
			},
			{
				id: 4,
				title: "반려동물 이동 캐리어",
				price: 25000,
				imageUrl:
					"https://images.unsplash.com/photo-1520087619250-584c0cbd35e8",
				status: "sold",
				createdAt: "2023-08-12",
				center: "무지개 다리 보호소",
			},
			{
				id: 5,
				title: "강아지 사료 (미개봉)",
				price: 18000,
				imageUrl:
					"https://images.unsplash.com/photo-1603189343302-e603f7add05f",
				status: "available",
				createdAt: "2023-08-11",
				center: "사랑이 넘치는 보호소",
			},
			{
				id: 6,
				title: "강아지 간식 모음",
				price: 12000,
				imageUrl:
					"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd",
				status: "available",
				createdAt: "2023-08-10",
				center: "행복한 강아지 센터",
			},
		];

		setItems(mockItems);
	}, []);

	const filteredItems = items
		.filter((item) => {
			if (activeTab === "all") return true;
			if (activeTab === "available") return item.status === "available";
			if (activeTab === "reserved") return item.status === "reserved";
			if (activeTab === "sold") return item.status === "sold";
			return true;
		})
		.filter(
			(item) =>
				searchQuery === "" ||
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.center.toLowerCase().includes(searchQuery.toLowerCase()),
		);

	const handleItemClick = (id: number) => {
		navigate(`/bazaar/${id}`);
	};

	const handleAddItem = () => {
		navigate("/bazaar/new");
	};

	return (
		<div className="flex flex-col w-full min-h-screen bg-background">
			{/* 헤더 */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="p-4 bg-white shadow-sm"
			>
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-[var(--color-main)]">
							바자회
						</h1>
						<Button
							variant="ghost"
							size="icon"
							className="text-[var(--color-main)] hover:bg-[var(--color-superLightBlueGray)]"
							onClick={handleAddItem}
						>
							<IoAddCircleOutline size={28} />
						</Button>
					</div>

					<div className="relative">
						<Input
							type="text"
							placeholder="상품이나 센터명으로 검색"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-4 py-2 rounded-full border-[var(--color-superLightGray)]"
						/>
						<IoSearchOutline
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-lightGray)]"
							size={20}
						/>
					</div>
				</div>
			</motion.div>

			{/* 탭 */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="w-full grid grid-cols-4 bg-[var(--color-superLightGray)] p-1 rounded-none">
					<TabsTrigger
						value="all"
						className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
					>
						전체
					</TabsTrigger>
					<TabsTrigger
						value="available"
						className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
					>
						판매중
					</TabsTrigger>
					<TabsTrigger
						value="reserved"
						className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
					>
						예약중
					</TabsTrigger>
					<TabsTrigger
						value="sold"
						className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
					>
						판매완료
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* 바자회 소개 */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="p-4 mx-4 my-4 bg-[var(--color-superLightBlueGray)] rounded-lg shadow-sm"
			>
				<h2 className="text-lg font-semibold text-[var(--color-blue)]">
					바자회 소개
				</h2>
				<p className="text-sm text-[var(--color-grayText)] mt-2">
					센터 회원들이 중고 물품을 거래하는 공간입니다. 거래된 금액은
					각 센터에 기부금으로 전액 사용됩니다. 여러분의 참여가
					유기견들에게 큰 도움이 됩니다.
				</p>
			</motion.div>

			{/* 상품 목록 */}
			<div className="flex-1 p-4 grid grid-cols-2 gap-4">
				{filteredItems.length > 0 ? (
					filteredItems.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 * index, duration: 0.3 }}
							onClick={() => handleItemClick(item.id)}
							className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						>
							<div className="relative h-36 w-full">
								<img
									src={item.imageUrl}
									alt={item.title}
									className="h-full w-full object-cover"
								/>
								{item.status !== "available" && (
									<div
										className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
											item.status === "reserved"
												? "text-yellow-400"
												: "text-red-500"
										}`}
									>
										<span className="font-bold text-lg">
											{item.status === "reserved"
												? "예약중"
												: "판매완료"}
										</span>
									</div>
								)}
							</div>
							<div className="p-3">
								<h3 className="font-medium text-sm mb-1 truncate">
									{item.title}
								</h3>
								<div className="flex justify-between items-center">
									<span className="text-[var(--color-main)] font-bold">
										{item.price.toLocaleString()}원
									</span>
									<span className="text-xs text-[var(--color-lightGray)]">
										{item.center}
									</span>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<div className="col-span-2 flex flex-col items-center justify-center py-12 text-[var(--color-lightGray)]">
						<p>검색 결과가 없습니다</p>
					</div>
				)}
			</div>
		</div>
	);
}

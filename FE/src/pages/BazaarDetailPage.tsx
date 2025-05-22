import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "../components/ui/tabs";
import { Avatar } from "../components/ui/avatar";
import {
	IoArrowBack,
	IoHeartOutline,
	IoHeart,
	IoShareSocial,
} from "react-icons/io5";
import { motion } from "framer-motion";

interface BazaarItem {
	id: number;
	title: string;
	description: string;
	price: number;
	imageUrl: string;
	status: "available" | "reserved" | "sold";
	createdAt: string;
	center: string;
	seller: {
		id: number;
		name: string;
		avatar: string;
	};
	category: string;
	condition: string;
	viewCount: number;
	likeCount: number;
}

export default function BazaarDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [item, setItem] = useState<BazaarItem | null>(null);
	const [isLiked, setIsLiked] = useState(false);
	const [activeTab, setActiveTab] = useState("description");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 실제 구현에서는 API 호출로 대체
		setTimeout(() => {
			const mockItem: BazaarItem = {
				id: Number(id),
				title: "강아지 장난감 세트",
				description:
					"저희 아이가 잘 가지고 놀지 않아서 판매합니다. 상태 좋고 깨끗하게 관리했습니다. 세척 완료했으며, 총 5종 세트입니다. 유기견 센터에 기부하고자 판매합니다.",
				price: 15000,
				imageUrl:
					"https://images.unsplash.com/photo-1581467655410-0e2f7bf4e83d",
				status: "available",
				createdAt: "2023-08-15",
				center: "행복한 강아지 센터",
				seller: {
					id: 1,
					name: "김멍멍",
					avatar: "https://i.pravatar.cc/150?img=1",
				},
				category: "장난감/용품",
				condition: "상급",
				viewCount: 42,
				likeCount: 5,
			};

			setItem(mockItem);
			setLoading(false);
		}, 500);
	}, [id]);

	const handleBack = () => {
		navigate(-1);
	};

	const toggleLike = () => {
		setIsLiked(!isLiked);
		if (item) {
			setItem({
				...item,
				likeCount: isLiked ? item.likeCount - 1 : item.likeCount + 1,
			});
		}
	};

	const handleReserve = () => {
		// 예약 기능 구현
		if (item && item.status === "available") {
			setItem({
				...item,
				status: "reserved",
			});
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "available":
				return "판매중";
			case "reserved":
				return "예약중";
			case "sold":
				return "판매완료";
			default:
				return "판매중";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "available":
				return "bg-[var(--color-main)] text-white";
			case "reserved":
				return "bg-yellow-400 text-white";
			case "sold":
				return "bg-red-500 text-white";
			default:
				return "bg-[var(--color-main)] text-white";
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="w-16 h-16 border-4 border-[var(--color-main)] border-t-transparent rounded-full animate-spin"></div>
				<p className="mt-4 text-[var(--color-grayText)]">로딩 중...</p>
			</div>
		);
	}

	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<p className="text-[var(--color-grayText)]">
					상품을 찾을 수 없습니다.
				</p>
				<Button variant="outline" className="mt-4" onClick={handleBack}>
					돌아가기
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full min-h-screen bg-background pb-20">
			{/* 헤더 */}
			<div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleBack}
					className="hover:bg-[var(--color-superLightGray)]"
				>
					<IoArrowBack size={24} />
				</Button>
				<h1 className="text-lg font-semibold">상품 상세</h1>
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-[var(--color-superLightGray)]"
				>
					<IoShareSocial size={24} />
				</Button>
			</div>

			{/* 상품 이미지 */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="w-full h-64 relative"
			>
				<img
					src={item.imageUrl}
					alt={item.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute top-4 right-4 p-2 bg-white bg-opacity-70 rounded-full">
					<Button
						variant="ghost"
						size="icon"
						className="p-0 h-8 w-8"
						onClick={toggleLike}
					>
						{isLiked ? (
							<IoHeart size={24} className="text-red-500" />
						) : (
							<IoHeartOutline size={24} />
						)}
					</Button>
				</div>
				{item.status !== "available" && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
						<span className="font-bold text-2xl text-white">
							{item.status === "reserved" ? "예약중" : "판매완료"}
						</span>
					</div>
				)}
			</motion.div>

			{/* 상품 기본 정보 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="p-4 bg-white"
			>
				<div className="flex justify-between items-start">
					<h2 className="text-xl font-bold">{item.title}</h2>
					<span
						className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
					>
						{getStatusLabel(item.status)}
					</span>
				</div>
				<p className="text-2xl font-bold text-[var(--color-main)] mt-2">
					{item.price.toLocaleString()}원
				</p>
				<div className="mt-4 flex items-center text-sm text-[var(--color-grayText)]">
					<span>조회 {item.viewCount}</span>
					<span className="mx-2">•</span>
					<span>관심 {item.likeCount}</span>
					<span className="mx-2">•</span>
					<span>{new Date(item.createdAt).toLocaleDateString()}</span>
				</div>
			</motion.div>

			{/* 판매자 정보 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mt-2 p-4 bg-white"
			>
				<div className="flex items-center">
					<Avatar className="h-12 w-12">
						{" "}
						<img
							src={item.seller.avatar}
							alt={item.seller.name}
						/>{" "}
					</Avatar>
					<div className="ml-3">
						<p className="font-medium">{item.seller.name}</p>
						<p className="text-sm text-[var(--color-grayText)]">
							{item.center}
						</p>
					</div>
				</div>
			</motion.div>

			{/* 상품 상세 탭 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mt-2 bg-white"
			>
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="w-full grid grid-cols-2 bg-[var(--color-superLightGray)] p-1 rounded-none">
						<TabsTrigger
							value="description"
							className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
						>
							상품 정보
						</TabsTrigger>
						<TabsTrigger
							value="info"
							className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-main)]"
						>
							거래 정보
						</TabsTrigger>
					</TabsList>
					<TabsContent value="description" className="p-4">
						<div className="mb-4">
							<h3 className="text-sm font-medium text-[var(--color-grayText)] mb-1">
								카테고리
							</h3>
							<p>{item.category}</p>
						</div>
						<div className="mb-4">
							<h3 className="text-sm font-medium text-[var(--color-grayText)] mb-1">
								상품 상태
							</h3>
							<p>{item.condition}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-[var(--color-grayText)] mb-1">
								상품 설명
							</h3>
							<p className="whitespace-pre-line">
								{item.description}
							</p>
						</div>
					</TabsContent>
					<TabsContent value="info" className="p-4">
						<div>
							<h3 className="text-sm font-medium text-[var(--color-grayText)] mb-2">
								바자회 거래 안내
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-sm">
								<li>
									모든 거래 금액은{" "}
									<span className="text-[var(--color-main)] font-semibold">
										해당 센터에 기부금
									</span>
									으로 전액 사용됩니다.
								</li>
								<li>
									예약 후 3일 이내에 센터를 방문하여 거래를
									완료해주세요.
								</li>
								<li>
									물품 상태에 대한 책임은 판매자에게 있습니다.
								</li>
								<li>센터에서 직접 거래하시면 더 안전합니다.</li>
								<li>
									판매된 금액은 유기견 보호와 치료에
									사용됩니다.
								</li>
							</ul>
						</div>
					</TabsContent>
				</Tabs>
			</motion.div>

			{/* 하단 고정 버튼 */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
				<Button
					className={`w-full py-6 ${item.status !== "available" ? "bg-gray-400" : "bg-[var(--color-main)]"}`}
					disabled={item.status !== "available"}
					onClick={handleReserve}
				>
					{item.status === "available"
						? "예약하기"
						: item.status === "reserved"
							? "예약중"
							: "거래완료"}
				</Button>
			</div>
		</div>
	);
}

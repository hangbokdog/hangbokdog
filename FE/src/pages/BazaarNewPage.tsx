import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { IoArrowBack, IoCamera, IoImage } from "react-icons/io5";
import { motion } from "framer-motion";

const CATEGORIES = [
	"장난감/용품",
	"사료/간식",
	"의류/패션",
	"하우스/가구",
	"이동장/가방",
	"목줄/하네스",
	"미용/케어",
	"기타",
];

const CONDITIONS = ["최상", "상", "중", "하"];

export default function BazaarNewPage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [images, setImages] = useState<string[]>([]);
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [condition, setCondition] = useState("");
	const [center, setCenter] = useState("행복한 강아지 센터");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleBack = () => {
		navigate(-1);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: string[] = [...images];

		for (let i = 0; i < files.length; i++) {
			if (newImages.length >= 5) break; // 최대 5개 이미지

			const file = files[i];
			const reader = new FileReader();

			reader.onload = (event) => {
				if (event.target?.result) {
					newImages.push(event.target.result as string);
					setImages([...newImages]);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	const removeImage = (index: number) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImages(newImages);
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsSubmitting(true);

		// 실제 구현에서는 API 호출
		setTimeout(() => {
			setIsSubmitting(false);
			navigate("/bazaar");
		}, 1000);
	};

	const validateForm = () => {
		if (images.length === 0) {
			alert("최소 1개의 상품 이미지를 등록해주세요.");
			return false;
		}

		if (!title.trim()) {
			alert("상품명을 입력해주세요.");
			return false;
		}

		if (!price.trim() || isNaN(Number(price))) {
			alert("유효한 가격을 입력해주세요.");
			return false;
		}

		if (!category) {
			alert("카테고리를 선택해주세요.");
			return false;
		}

		if (!condition) {
			alert("상품 상태를 선택해주세요.");
			return false;
		}

		if (!description.trim()) {
			alert("상품 설명을 입력해주세요.");
			return false;
		}

		return true;
	};

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
				<h1 className="text-lg font-semibold">상품 등록</h1>
				<div className="w-10" /> {/* 균형을 위한 빈 공간 */}
			</div>

			<div className="flex-1 p-4">
				<form className="space-y-6">
					{/* 이미지 업로드 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-2"
					>
						<label className="text-sm font-medium text-[var(--color-grayText)]">
							상품 이미지 <span className="text-red-500">*</span>
							<span className="text-xs ml-1">(최대 5장)</span>
						</label>

						<div className="grid grid-cols-5 gap-2">
							{images.map((image, index) => (
								<div
									key={index}
									className="relative h-16 w-16 rounded-md overflow-hidden"
								>
									<img
										src={image}
										alt={`상품 이미지 ${index + 1}`}
										className="h-full w-full object-cover"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
									>
										×
									</button>
								</div>
							))}

							{images.length < 5 && (
								<button
									type="button"
									onClick={() =>
										fileInputRef.current?.click()
									}
									className="h-16 w-16 border-2 border-dashed border-[var(--color-lightGray)] rounded-md flex flex-col items-center justify-center text-[var(--color-lightGray)]"
								>
									<IoCamera size={20} />
									<span className="text-xs mt-1">
										{images.length > 0 ? "추가" : "등록"}
									</span>
								</button>
							)}

							<input
								type="file"
								accept="image/*"
								multiple
								ref={fileInputRef}
								onChange={handleImageUpload}
								className="hidden"
							/>
						</div>
					</motion.div>

					{/* 기본 정보 */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="space-y-4"
					>
						<div className="space-y-2">
							<label
								htmlFor="title"
								className="text-sm font-medium text-[var(--color-grayText)]"
							>
								상품명 <span className="text-red-500">*</span>
							</label>
							<Input
								id="title"
								placeholder="상품명을 입력해주세요"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="price"
								className="text-sm font-medium text-[var(--color-grayText)]"
							>
								판매가격 <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Input
									id="price"
									type="number"
									placeholder="숫자만 입력해주세요"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									className="pr-10"
								/>
								<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-grayText)]">
									원
								</span>
							</div>
							<p className="text-xs text-[var(--color-main)]">
								* 판매 금액은 전액 센터에 기부됩니다.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-[var(--color-grayText)]">
									카테고리{" "}
									<span className="text-red-500">*</span>
								</label>
								<Select
									value={category}
									onValueChange={setCategory}
								>
									<SelectTrigger>
										<SelectValue placeholder="선택해주세요" />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIES.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-[var(--color-grayText)]">
									상품 상태{" "}
									<span className="text-red-500">*</span>
								</label>
								<Select
									value={condition}
									onValueChange={setCondition}
								>
									<SelectTrigger>
										<SelectValue placeholder="선택해주세요" />
									</SelectTrigger>
									<SelectContent>
										{CONDITIONS.map((cond) => (
											<SelectItem key={cond} value={cond}>
												{cond}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</motion.div>

					{/* 상세 정보 */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-2"
					>
						<label
							htmlFor="description"
							className="text-sm font-medium text-[var(--color-grayText)]"
						>
							상품 설명 <span className="text-red-500">*</span>
						</label>
						<textarea
							id="description"
							placeholder="상품 상태, 사용감, 구매 시기 등 상세한 정보를 작성해주세요."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={5}
							className="w-full rounded-md border border-[var(--color-superLightGray)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-main)]"
						/>
					</motion.div>

					{/* 거래 센터 */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-2"
					>
						<label className="text-sm font-medium text-[var(--color-grayText)]">
							거래 센터
						</label>
						<Select
							value={center}
							onValueChange={setCenter}
							disabled
						>
							<SelectTrigger>
								<SelectValue placeholder="선택해주세요" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="행복한 강아지 센터">
									행복한 강아지 센터
								</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-[var(--color-grayText)]">
							* 현재 가입된 센터에서만 거래할 수 있습니다.
						</p>
					</motion.div>

					{/* 바자회 안내 */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="p-4 bg-[var(--color-superLightBlueGray)] rounded-lg"
					>
						<h3 className="text-sm font-medium text-[var(--color-blue)] mb-2">
							바자회 안내
						</h3>
						<ul className="text-xs space-y-1 text-[var(--color-grayText)] list-disc pl-4">
							<li>상품은 센터 방문 시 직접 거래합니다.</li>
							<li>
								거래 금액은 전액 센터에 기부되어 유기견 보호에
								사용됩니다.
							</li>
							<li>
								부적절한 물품은 관리자에 의해 삭제될 수
								있습니다.
							</li>
							<li>
								물품 상태에 대한 책임은 판매자에게 있습니다.
							</li>
						</ul>
					</motion.div>
				</form>
			</div>

			{/* 하단 고정 버튼 */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
				<Button
					className="w-full py-6 bg-[var(--color-main)]"
					onClick={handleSubmit}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<div className="flex items-center justify-center">
							<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							<span>등록 중...</span>
						</div>
					) : (
						"등록하기"
					)}
				</Button>
			</div>
		</div>
	);
}

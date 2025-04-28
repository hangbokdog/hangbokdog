import { useRef, useState } from "react";
import DogCard from "@/components/common/DogCard";
import Search from "@/components/common/Search";
import AISearchPanel from "@/components/common/AISearchPanel";
import ScrollButton from "@/components/common/ScrollButton";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";

// 더미 데이터
const dummyDogs = [
	{
		id: 101,
		name: "모리",
		age: "7개월",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 102,
		name: "찬희",
		age: "6살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 103,
		name: "백돌",
		age: "2개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
	{
		id: 104,
		name: "코코",
		age: "1살",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 105,
		name: "루시",
		age: "3살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 106,
		name: "초코",
		age: "5개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
	{
		id: 107,
		name: "보리",
		age: "2살",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 108,
		name: "하니",
		age: "8개월",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 109,
		name: "댕댕이",
		age: "3개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
	{
		id: 110,
		name: "해피",
		age: "4살",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 111,
		name: "룰루",
		age: "1살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 112,
		name: "몽실이",
		age: "9개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
	{
		id: 113,
		name: "별이",
		age: "5살",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 114,
		name: "나비",
		age: "2살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 115,
		name: "달이",
		age: "7개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
	{
		id: 116,
		name: "꼬미",
		age: "3살",
		imageUrl: dog1,
		gender: "MALE",
		isLiked: false,
	},
	{
		id: 117,
		name: "두부",
		age: "1살",
		imageUrl: dog2,
		gender: "FEMALE",
		isLiked: true,
	},
	{
		id: 118,
		name: "콩이",
		age: "4개월",
		imageUrl: dog3,
		gender: "FEMALE",
		isLiked: false,
	},
];

export default function SponsorShipPage() {
	const topRef = useRef<HTMLDivElement>(null);
	const [showImageSearch, setShowImageSearch] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleImageSearch = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setShowImageSearch(!showImageSearch);
			setIsAnimating(false);
		}, 150);
	};

	const handleSearch = (query: string) => {
		console.log("검색어:", query);
	};

	const handleFileSelect = (file: File) => {
		console.log("선택된 파일:", file.name);
	};

	return (
		<div className="scrollbar-hidden relative flex flex-col gap-3 pt-2.5 pb-2.5">
			<span ref={topRef} className="font-bold text-grayText">
				여러분의 관심이 아이들을 살립니다.
			</span>
			<div
				className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
			>
				{!showImageSearch ? (
					<Search
						onClickAISearch={toggleImageSearch}
						placeholder="아이의 이름을 입력해주세요."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onSearch={handleSearch}
					/>
				) : (
					<AISearchPanel
						onClose={toggleImageSearch}
						onFileSelect={handleFileSelect}
						title="이미지로 강아지 검색"
					/>
				)}
			</div>
			<div className="max-w-[382px] grid grid-cols-3 gap-2.5">
				{dummyDogs.map((dog) => (
					<DogCard
						key={dog.id}
						id={dog.id}
						name={dog.name}
						age={dog.age}
						imageUrl={dog.imageUrl}
						gender={dog.gender as "MALE" | "FEMALE"}
						isLiked={dog.isLiked}
						bgColor="bg-white"
					/>
				))}
			</div>
			<ScrollButton targetRef={topRef} />
		</div>
	);
}

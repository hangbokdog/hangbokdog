// 이 컴포넌트 쓸까말까 고민...

import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import brownDog from "@/assets/images/browndog.svg";
import drugs from "@/assets/images/drugs.svg";
import dogWithFlower from "@/assets/images/dogwithflower.svg";

type CardProps = {
	title: string;
	imageSrc: string;
	buttonText: string;
	multipleImages?: boolean;
	linkTo: string;
};

type ViewAllButtonProps = {
	linkTo: string;
};

function ViewAllButton({ linkTo }: ViewAllButtonProps) {
	return (
		<Link
			to={linkTo}
			className="absolute top-5 right-5 text-gray-400 text-xs flex items-center"
		>
			전체보기 <ChevronRight className="h-3 w-3 ml-1" />
		</Link>
	);
}

function Card({
	title,
	imageSrc,
	buttonText,
	multipleImages = false,
	linkTo,
}: CardProps) {
	const navigate = useNavigate();
	return (
		<div className="relative bg-white rounded-3xl p-6 mb-4 shadow-sm">
			<ViewAllButton linkTo={linkTo} />

			<div className="flex justify-center items-center mb-4">
				{multipleImages ? (
					<div className="rounded-full w-48 h-48 flex justify-center items-center relative">
						<img
							src={brownDog}
							alt="Brown puppy"
							width={80}
							height={80}
							className="absolute left-12 bottom-14"
						/>
						<img
							src={dogWithFlower}
							alt="Flower"
							width={30}
							height={30}
							className="absolute left-24 bottom-10"
						/>
						<img
							src={drugs}
							alt="Drugs"
							width={90}
							height={90}
							className="absolute right-12 bottom-10"
						/>
					</div>
				) : (
					<img
						src={imageSrc || "/placeholder.svg"}
						alt={title}
						width={100}
						height={100}
						className="object-contain"
					/>
				)}
			</div>

			<div className="flex justify-center">
				<button
					type="button"
					className="w-52 mx-auto py-3 bg-background rounded-full text-gray-700 font-medium text-sm"
					onClick={() => navigate(linkTo)}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
}

export default function DogManage() {
	return (
		<div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
			<Card
				title="아이들 전체보기"
				imageSrc={dogWithFlower}
				buttonText="아이들 전체보기"
				linkTo="/kids"
			/>

			<Card
				title="관심 아이들"
				imageSrc={brownDog}
				buttonText="관심 아이들"
				linkTo="/checked"
			/>

			<Card
				title="복약 필요한 아이들"
				imageSrc={drugs}
				buttonText="복약 필요한 아이들"
				linkTo="/drugs"
			/>
		</div>
	);
}

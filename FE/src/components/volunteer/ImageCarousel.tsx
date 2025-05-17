import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ImageIcon } from "lucide-react";

export default function ImageCarousel({ images }: { images: string[] }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSelect = (api: CarouselApi) => {
		if (!api) return;
		setCurrentIndex(api.selectedScrollSnap());
	};

	// 이미지가 없는 경우 대체 UI 표시
	if (!images || images.length === 0) {
		return (
			<div className="relative max-w-[440px] h-[300px] overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center px-6">
				<div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
					<ImageIcon className="w-10 h-10 text-gray-400" />
				</div>
				<h3 className="text-lg font-medium text-gray-700">
					이미지가 없습니다
				</h3>
				<p className="text-sm text-gray-500 mt-2 max-w-[200px]">
					현재 등록된 사진이 없습니다. 봉사 활동 사진은 추후
					업데이트될 수 있습니다.
				</p>
			</div>
		);
	}

	return (
		<div className="relative max-w-[440px] h-[300px] overflow-hidden">
			<div
				className="absolute inset-0 -z-0"
				style={{
					backgroundImage: `url(${images[currentIndex]})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
					filter: "blur(10px) brightness(0.7)",
					transform: "scale(1.1)",
				}}
			/>
			<Carousel
				opts={{
					align: "center",
					loop: true,
					skipSnaps: false,
					containScroll: false,
				}}
				plugins={[
					Autoplay({
						delay: 4000,
					}),
				]}
				className="w-full h-full flex justify-center items-center"
				setApi={(api) => {
					if (!api) return;
					api.on("select", () => handleSelect(api));
				}}
			>
				<CarouselContent className="-ml-0">
					{images.map((image, index) => (
						<CarouselItem
							key={image}
							className="relative transition-all pl-0 duration-200 ease-in-out basis-[250px]"
						>
							<div
								className={cn(
									"relative w-[250px] h-[250px] transition-all duration-300",
									currentIndex === index
										? "scale-100 opacity-100 z-20"
										: index ===
													(currentIndex + 1) %
														images.length ||
												index ===
													(currentIndex -
														1 +
														images.length) %
														images.length
											? "scale-70 opacity-50 z-10"
											: "scale-50 opacity-0 z-0",
								)}
							>
								<img
									src={image}
									alt={`슬라이드 ${index + 1}`}
									className="w-full h-full object-cover rounded-lg"
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-4" />
				<CarouselNext className="right-4" />
			</Carousel>
		</div>
	);
}

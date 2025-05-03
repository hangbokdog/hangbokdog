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
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";

const images = [dog1, dog2, dog3] as const;

export default function ImageCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSelect = (api: CarouselApi) => {
		if (!api) return;
		setCurrentIndex(api.selectedScrollSnap());
	};

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
				className="w-full h-full flex items-center"
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

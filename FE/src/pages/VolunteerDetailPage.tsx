import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import dog1 from "@/assets/images/dog1.png";
import dog2 from "@/assets/images/dog2.png";
import dog3 from "@/assets/images/dog3.png";
import { VscLocation } from "react-icons/vsc";

const images = [dog1, dog2, dog3] as const;

export default function VolunteerDetailPage() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSelect = (api: CarouselApi) => {
		if (!api) return;
		setCurrentIndex(api.selectedScrollSnap());
	};

	return (
		<div className="flex flex-col">
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
			<div className="flex flex-col p-2.5 gap-2.5">
				<div className="flex flex-col p-2.5 gap-2.5 bg-white rounded-[8px] shadow-custom-sm">
					<div className="flex gap-2 items-center">
						<span className="text-xl font-bold">쉼뜰 봉사</span>
						<span className="font-semibold text-white bg-green px-2.5 py-1 rounded-3xl">
							접수중
						</span>
					</div>
					<span className="text-grayText font-medium">
						2025.04.14(월) ~ 2025.04.20(일)
					</span>
					<span className="inline-flex gap-1 items-center">
						<VscLocation className="size-5 text-blueGray" />
						<span className="text-blueGray font-medium">
							파주 어딘가
						</span>
					</span>
					<span className="text-grayText font-medium">
						오전 10:00 ~ 14:00 / 오후 15:00 ~ 18:00
					</span>
					<span className="text-grayText font-medium">
						루체 | 리옹 | 시저가 먹고싶었던 쿠다 | 북청사자놀음
					</span>
				</div>
				<Tabs
					defaultValue="activity"
					className="w-full bg-white shadow-custom-sm p-2.5 rounded-[8px]"
				>
					<TabsList className="w-full p-0 bg-transparent">
						<TabsTrigger
							value="activity"
							className="flex-1 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-lightGray data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none hover:bg-transparent data-[state=active]:shadow-none"
						>
							활동 일지
						</TabsTrigger>
						<TabsTrigger
							value="apply"
							className="flex-1 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-lightGray data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none hover:bg-transparent data-[state=active]:shadow-none"
						>
							봉사 신청
						</TabsTrigger>
						<TabsTrigger
							value="guide"
							className="flex-1 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-lightGray data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none hover:bg-transparent data-[state=active]:shadow-none"
						>
							봉사 안내
						</TabsTrigger>
						<TabsTrigger
							value="caution"
							className="flex-1 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-lightGray data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none hover:bg-transparent data-[state=active]:shadow-none"
						>
							주의 사항
						</TabsTrigger>
					</TabsList>
					<TabsContent value="activity" className="mt-2.5">
						활동 일지 내용
					</TabsContent>
					<TabsContent value="apply" className="mt-2.5">
						봉사 신청 내용
					</TabsContent>
					<TabsContent value="guide" className="mt-2.5">
						봉사 안내 내용
					</TabsContent>
					<TabsContent value="caution" className="mt-2.5">
						주의 사항 내용
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

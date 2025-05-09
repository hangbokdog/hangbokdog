import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUser, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DogInfoCard from "./DogInfoCard";
import { fetchDogSponsors, type DogSponsor } from "@/api/dog";

interface DogSponsorsProps {
	sponsorCount: number;
	dogId: number;
}

export default function DogSponsors({ sponsorCount, dogId }: DogSponsorsProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const isFull = sponsorCount === 2;

	const {
		data: sponsors,
		isLoading,
		error,
	} = useQuery<DogSponsor[], Error>({
		queryKey: ["dogSponsors", dogId],
		queryFn: () => fetchDogSponsors(Number(dogId)),
		enabled: isExpanded && !!dogId,
	});

	const handleClick = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<DogInfoCard title="결연자">
			<div className="flex flex-col gap-2">
				<button
					type="button"
					onClick={handleClick}
					className="flex items-center gap-2 text-sm px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
				>
					<span className={isFull ? "text-red-500" : "text-gray-500"}>
						({sponsorCount}/2)
					</span>
					{isExpanded ? (
						<FaChevronUp className="text-gray-500" />
					) : (
						<FaChevronDown className="text-gray-500" />
					)}
				</button>
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className="overflow-hidden"
						>
							<div className="flex items-center gap-2">
								{isLoading ? (
									<div className="flex items-center justify-center py-2 w-full">
										<svg
											className="animate-spin h-5 w-5 text-gray-500"
											viewBox="0 0 24 24"
										>
											<title>Loading...</title>
											<circle
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
												fill="none"
											/>
										</svg>
									</div>
								) : error ? (
									<div className="text-center py-2 text-red-500 w-full">
										결연자 정보를 불러오지 못했습니다.
									</div>
								) : sponsors && sponsors.length > 0 ? (
									<div className="flex gap-2">
										{sponsors.map((sponsor) => (
											<div
												key={sponsor.memberId}
												className="flex flex-col items-center gap-1"
											>
												<Avatar className="size-12">
													{sponsor.profileImage ? (
														<AvatarImage
															src={
																sponsor.profileImage
															}
															alt={sponsor.name}
															className="object-cover"
														/>
													) : (
														<AvatarFallback>
															<FaUser className="text-gray-400 size-6" />
														</AvatarFallback>
													)}
												</Avatar>
												<span className="text-sm font-medium">
													{sponsor.name}
												</span>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-2 text-gray-500 w-full">
										아직 결연자가 없습니다.
									</div>
								)}
								<span
									className={`text-sm ${isFull ? "text-red-500" : "text-gray-500"}`}
								>
									({sponsorCount}/2)
								</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</DogInfoCard>
	);
}

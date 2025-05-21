import DogCard from "@/components/common/DogCard";
import type { DogSummary } from "@/types/dog";
import { ChevronRight } from "lucide-react";
import { MdPets } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface DogPanelProps {
	count: number;
	dogSummaries: DogSummary[];
}

export default function DogPanel({ count, dogSummaries }: DogPanelProps) {
	return (
		<div className="flex flex-col p-2.5 border-t-1 bg-blue-50">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-bold">보호중인 아이들</h3>
					<span className="font-bold text-male">{count}</span>
				</div>
				<Link
					to="/dogs"
					className="flex items-center text-sm text-gray-800 font-medium"
				>
					전체보기
					<ChevronRight className="w-4 h-4 ml-0.5" />
				</Link>
			</div>
			<div className="flex overflow-x-auto scrollbar-hidden gap-3 pb-2.5">
				{dogSummaries.map((dog) => (
					<div
						key={dog.dogId}
						className="w-[160px] sm:w-[170px] md:w-[180px] flex-shrink-0"
					>
						<DogCard
							dogId={dog.dogId}
							name={dog.name}
							ageMonth={String(dog.ageMonth)}
							imageUrl={dog.imageUrl}
							gender={dog.gender as "MALE" | "FEMALE"}
							isFavorite={dog.isFavorite}
						/>
					</div>
				))}
				<Link
					to="/dogs"
					className="w-[160px] sm:w-[170px] md:w-[180px] flex-shrink-0 rounded-lg relative overflow-hidden h-full min-h-[240px] shadow-md"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600" />
					<motion.div
						className="absolute inset-0 flex flex-col items-center justify-center p-4"
						whileTap={{ scale: 0.98 }}
						initial={{ opacity: 0.9 }}
						whileHover={{ opacity: 1 }}
					>
						<div className="bg-white/20 rounded-full p-3 backdrop-blur-md mb-3 shadow-inner">
							<MdPets className="w-7 h-7 text-white" />
						</div>
						<h3 className="text-white font-bold text-lg text-center mb-1 drop-shadow-md">
							더 많은 아이들
						</h3>
						<p className="text-white/90 text-sm text-center mb-3">
							새로운 친구들을 만나보세요
						</p>
						<motion.div
							className="bg-white/30 rounded-full py-1.5 px-3 backdrop-blur-sm flex items-center"
							whileHover={{
								backgroundColor: "rgba(255,255,255,0.4)",
							}}
						>
							<span className="text-white text-sm font-medium mr-1">
								더 보기
							</span>
							<ChevronRight className="w-4 h-4 text-white" />
						</motion.div>

						{/* 배경 장식 요소 */}
						<motion.div
							className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10"
							animate={{
								scale: [1, 1.05, 1],
								opacity: [0.3, 0.4, 0.3],
							}}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 3,
								ease: "easeInOut",
							}}
						/>
						<motion.div
							className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-white/10"
							animate={{
								scale: [1, 1.1, 1],
								opacity: [0.2, 0.3, 0.2],
							}}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 4,
								ease: "easeInOut",
								delay: 1,
							}}
						/>
					</motion.div>
				</Link>
			</div>
		</div>
	);
}

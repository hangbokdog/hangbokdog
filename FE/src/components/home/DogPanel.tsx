import DogCard from "@/components/common/DogCard";
import type { DogSummary } from "@/types/dog";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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
					className="w-[160px] sm:w-[170px] md:w-[180px] flex-shrink-0 bg-gray-600/70 rounded-lg flex flex-col items-center justify-center h-full min-h-[240px] border border-gray-300 hover:bg-gray-700/80 transition-colors"
				>
					<span className="text-gray-900  font-medium text-center">
						아이들 더 보러 가기
					</span>
					<ChevronRight className="w-5 h-5 mt-2 text-gray-900" />
				</Link>
			</div>
		</div>
	);
}

import PanelTitle from "../common/PanelTitle";
import DogCard from "@/components/common/DogCard";
import type { DogSummary } from "@/types/dog";

interface DogPanelProps {
	count: number;
	dogSummaries: DogSummary[];
}

export default function DogPanel({ count, dogSummaries }: DogPanelProps) {
	return (
		<div className="flex flex-col mx-2.5 p-2.5 rounded-[8px] bg-white shadow-custom-sm">
			<PanelTitle
				title="보호중인 아이들"
				link="/dogs"
				subTitle={String(count)}
			/>
			<div className="flex overflow-x-auto scrollbar-hidden gap-2.5 pb-2.5 max-w-[400px]">
				{dogSummaries.map((dog) => (
					<div key={dog.dogId} className="min-w-[50%] flex-shrink-0">
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
			</div>
		</div>
	);
}

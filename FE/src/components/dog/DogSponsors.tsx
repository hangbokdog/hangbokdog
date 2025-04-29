import { FaUser } from "react-icons/fa";
import DogInfoCard from "./DogInfoCard";

interface Sponsor {
	id: number;
	name: string;
	profileImage?: string;
}

interface DogSponsorsProps {
	sponsors: Sponsor[];
}

export default function DogSponsors({ sponsors }: DogSponsorsProps) {
	const isFull = sponsors.length === 2;

	return (
		<DogInfoCard title="결연자">
			<div className="flex items-center gap-2">
				<div className="flex gap-2">
					{sponsors.length > 0 ? (
						sponsors.map((sponsor) => (
							<div
								key={sponsor.id}
								className="flex flex-col items-center gap-1"
							>
								<div className="size-12 rounded-full bg-gray-200 flex items-center justify-center">
									{sponsor.profileImage ? (
										<img
											src={sponsor.profileImage}
											alt={sponsor.name}
											className="w-full h-full rounded-full object-cover"
										/>
									) : (
										<FaUser className="text-gray-400 size-6" />
									)}
								</div>
								<span className="text-sm font-medium">
									{sponsor.name}
								</span>
							</div>
						))
					) : (
						<div className="text-center py-2 text-gray-500">
							아직 결연자가 없습니다.
						</div>
					)}
				</div>
				<span
					className={`text-sm ${
						isFull ? "text-red-500" : "text-gray-500"
					}`}
				>
					({sponsors.length}/2)
				</span>
			</div>
		</DogInfoCard>
	);
}

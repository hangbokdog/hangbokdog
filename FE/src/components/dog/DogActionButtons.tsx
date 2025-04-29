import { Link } from "react-router-dom";

interface DogActionButtonsProps {
	sponsorLink: string;
	adoptionLink: string;
}

export default function DogActionButtons({
	sponsorLink,
	adoptionLink,
}: DogActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Link to={sponsorLink}>
				<button
					type="button"
					className="bg-main text-white rounded-full px-4 py-2 font-bold cursor-pointer"
				>
					결연하기
				</button>
			</Link>
			<Link to={adoptionLink}>
				<button
					type="button"
					className="bg-green text-white rounded-full px-4 py-2 font-bold cursor-pointer"
				>
					입양하기
				</button>
			</Link>
		</div>
	);
}

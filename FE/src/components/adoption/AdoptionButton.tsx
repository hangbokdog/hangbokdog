import { Link } from "react-router-dom";

interface AdoptionButtonProps {
	isChecked: boolean;
}

export default function AdoptionButton({ isChecked }: AdoptionButtonProps) {
	return (
		<Link
			to={
				"https://docs.google.com/forms/d/e/1FAIpQLSdprLTSbQHm8nZulb266VOza-yxB0pqDmiLaR32e1B46rR4aw/viewform"
			}
			target="_blank"
		>
			<button
				type="button"
				className={`w-full py-3 rounded-lg mb-2.5 text-white ${
					isChecked ? "bg-green" : "bg-gray-300"
				}`}
				disabled={!isChecked}
			>
				입양하기
			</button>
		</Link>
	);
}

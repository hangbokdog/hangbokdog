import dog_donation from "@/assets/images/dog_donation.png";
import { Link } from "react-router-dom";

export default function DonationPanel() {
	return (
		<div className="flex flex-col p-2.5 gap-1 rounded-3xl bg-white shadow-custom-xs items-center">
			<img className="w-28 h-24" src={dog_donation} alt="dog_donation" />
			<Link className="w-full" to={"/donations"}>
				<button
					type="button"
					className="w-full rounded-full bg-background inline-flex items-center justify-center gap-2 py-1 text-grayText font-semibold"
				>
					후원하러 가기
				</button>
			</Link>
		</div>
	);
}

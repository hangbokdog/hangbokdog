import donation_heart from "@/assets/images/donation_heart.png";

export default function MileageCard() {
	return (
		<div className="flex flex-col w-full h-full p-2.5 mx-2.5 gap-1 rounded-3xl bg-white shadow-custom-xs items-center">
			<span className="font-semibold inline-flex items-center gap-1">
				나의 마일리지
				<img
					className="size-6"
					src={donation_heart}
					alt="donation_heart"
				/>
			</span>
			<div className="flex-1 flex items-center justify-center">
				<span className="text-2xl font-extrabold text-blue">
					5,000,000 원
				</span>
			</div>
		</div>
	);
}

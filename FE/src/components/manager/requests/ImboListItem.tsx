interface ImboListItemProps {
	img: string;
	name: string;
	kid: string;
	index: number;
}

export default function ImboListItem(props: ImboListItemProps) {
	const { img, name, kid, index } = props;
	const hidingErrorImg = (
		e: React.SyntheticEvent<HTMLImageElement, Event>,
	): void => {
		console.log("Error loading image");
		e.currentTarget.onerror = null;
		e.currentTarget.style.display = "none";
	};

	return (
		<div
			className={`flex rounded-full ${index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}
		>
			<div className="flex w-32 text-[var(--color-blueGray)] font-semibold items-center gap-2">
				<div className="w-4 h-4 rounded-full overflow-hidden justify-center items-center">
					<img
						src={img}
						alt="Volunteer"
						className="w-4 h-4 object-cover"
						onError={() => hidingErrorImg}
					/>
				</div>
				{name} 님
			</div>
			<div className="flex-1 flex justify-center items-center gap-2.5">
				{kid}
			</div>
		</div>
	);
}

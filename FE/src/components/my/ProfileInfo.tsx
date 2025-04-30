type ProfileInfoProps = {
	name: string;
	imageUrl?: string;
	size?: "sm" | "md" | "lg";
};

export function ProfileInfo({ name, imageUrl, size = "md" }: ProfileInfoProps) {
	const sizeClasses = {
		sm: "w-8 h-8 text-sm",
		md: "w-10 h-10 text-base",
		lg: "w-16 h-16 text-lg",
	};

	return (
		<div className="flex items-center gap-2">
			{imageUrl ? (
				<img
					src={imageUrl}
					alt={name}
					className={`rounded-full object-cover ${sizeClasses[size]}`}
				/>
			) : (
				<div
					className={`rounded-full bg-gray-300 flex items-center justify-center font-bold text-white ${sizeClasses[size]}`}
				>
					{name.charAt(0)}
				</div>
			)}
			<span className="font-medium text-base">{name}</span>
		</div>
	);
}

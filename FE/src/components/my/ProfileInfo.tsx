type ProfileInfoProps = {
	name: string;
	imageUrl?: string;
	size?: "sm" | "md" | "lg";
	email?: string;
};

export function ProfileInfo({
	name,
	imageUrl,
	size = "md",
	email,
}: ProfileInfoProps) {
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
			<div className="flex flex-col">
				<span className="font-medium text-base">{name}</span>
				<span className="text-sm text-gray-500">{email}</span>
			</div>
		</div>
	);
}

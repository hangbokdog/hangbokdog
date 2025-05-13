interface DogImageProps {
	src: string;
	alt: string;
	onClick?: () => void;
	className?: string;
}

export default function DogImage({
	src,
	alt,
	onClick,
	className,
}: DogImageProps) {
	return (
		<div className="w-full h-[350px] bg-gray-200">
			<img
				className={`object-cover w-full h-full ${className}`}
				src={src}
				alt={alt}
				onClick={onClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" && onClick) {
						onClick();
					}
				}}
			/>
		</div>
	);
}

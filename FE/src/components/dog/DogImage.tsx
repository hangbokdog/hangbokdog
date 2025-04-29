interface DogImageProps {
	src: string;
	alt: string;
}

export default function DogImage({ src, alt }: DogImageProps) {
	return (
		<div className="w-full h-[250px] bg-gray-200">
			<img className="object-cover w-full h-full" src={src} alt={alt} />
		</div>
	);
}

import { IoIosArrowForward } from "react-icons/io";

interface OngoingVolunteerImageProps {
	src: string;
	alt: string;
}

export default function OngoingVolunteerImage({
	src,
	alt,
}: OngoingVolunteerImageProps) {
	return (
		<div className="relative w-full h-full">
			<img className="w-full h-full object-cover" src={src} alt={alt} />
			<div className="absolute inset-0 bg-custom-gradient" />
			<span className="absolute bg-white right-1 bottom-1 rounded-full inline-flex items-center justify-center px-2 py-1">
				<IoIosArrowForward className="size-4 text-grayText" />
			</span>
		</div>
	);
}

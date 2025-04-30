import { FaArrowUp } from "react-icons/fa6";
import type { RefObject } from "react";

interface ScrollButtonProps {
	targetRef?: RefObject<HTMLElement | HTMLDivElement | null>;
}

export default function ScrollButton({ targetRef }: ScrollButtonProps) {
	const scrollToTop = () => {
		if (targetRef?.current) {
			targetRef.current.scrollIntoView({ behavior: "smooth" });
		} else {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<button
			onClick={scrollToTop}
			type="button"
			className="
				fixed
				bg-primary hover:bg-gray-700
				bottom-16 
				right-[calc((100vw-440px)/2+10px)]
				size-8
                rounded-full 
                flex items-center justify-center
                z-50
                transition-all 
                duration-300
                cursor-pointer
                hover:scale-110
                active:scale-95
            "
			aria-label="페이지 상단으로 이동"
		>
			<FaArrowUp className="text-white size-4" />
		</button>
	);
}

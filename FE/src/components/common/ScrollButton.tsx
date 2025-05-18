import { FaArrowUp } from "react-icons/fa6";
import type { RefObject } from "react";
import { useEffect, useState } from "react";

interface ScrollButtonProps {
	targetRef?: RefObject<HTMLElement | HTMLDivElement | null>;
}

export default function ScrollButton({ targetRef }: ScrollButtonProps) {
	const [rightPosition, setRightPosition] = useState("10px");

	// 화면 크기에 따라 동적으로 위치 계산
	useEffect(() => {
		const updatePosition = () => {
			const viewportWidth = window.innerWidth;
			const containerWidth = Math.min(440, viewportWidth);

			// 화면 너비가 440px보다 크면 중앙 정렬, 아니면 오른쪽 여백 사용
			if (viewportWidth > 440) {
				const rightValue = (viewportWidth - containerWidth) / 2 + 10;
				setRightPosition(`${rightValue}px`);
			} else {
				// 모바일에서는 오른쪽 여백만 적용
				setRightPosition("10px");
			}
		};

		// 초기 계산 및 리사이즈 이벤트 리스너 등록
		updatePosition();
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("resize", updatePosition);
		};
	}, []);

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
			style={{ right: rightPosition }}
			className="
				fixed
				bg-primary hover:bg-gray-700
				bottom-16 
				size-8
                rounded-full 
                flex items-center justify-center
                z-50
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

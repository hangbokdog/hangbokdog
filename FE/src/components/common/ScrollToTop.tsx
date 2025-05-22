import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname 린터 오류 무시
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

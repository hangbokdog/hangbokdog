import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 실제 뷰포트 높이 계산 (모바일 브라우저 대응)
const setVhProperty = () => {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// 초기 설정 및 리사이즈 이벤트 리스너
setVhProperty();
window.addEventListener("resize", setVhProperty);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5분
			retry: 1,
		},
	},
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");
createRoot(rootElement).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>,
);

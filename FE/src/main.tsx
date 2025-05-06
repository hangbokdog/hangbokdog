import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");
createRoot(rootElement).render(<RouterProvider router={router} />);

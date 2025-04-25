import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import App from "./App";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <App />,
			},
		],
	},
]);

export default router;

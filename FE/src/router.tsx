import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DonationLayout from "./layouts/DonationLayout";
import SponsorShipPage from "./pages/SponsorShipPage";
import ManagerMainLayout from "./layouts/ManagerMainLayout";
import ManagerMain from "./pages/manager/ManagerMain";
const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "donations",
				element: <DonationLayout />,
				children: [
					{
						index: true,
						element: <SponsorShipPage />,
					},
				],
			},
		],
	},
	{
		path: "/manager",
		element: <ManagerMainLayout />,
		children: [
			{
				index: true,
				element: <ManagerMain />,
			},
		],
	},
]);

export default router;

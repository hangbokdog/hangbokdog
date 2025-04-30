import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DonationLayout from "./layouts/DonationLayout";
import SponsorShipPage from "./pages/SponsorShipPage";
import ManagerMainLayout from "./layouts/ManagerMainLayout";
import ManagerMain from "./pages/manager/ManagerMain";
import ManagerVolunteer from "./pages/manager/ManagerVolunteer";
import DogDetailPage from "./pages/DogDetailPage";
import My from "./pages/My";

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
				path: "my",
				element: <My />,
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
			{
				path: "dogs",
				children: [
					{
						path: ":id",
						element: <DogDetailPage />,
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
			{
				path: "volunteer",
				element: <ManagerVolunteer />,
				handle: { showHeader: false },
			},
		],
	},
]);

export default router;

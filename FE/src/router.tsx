import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DonationLayout from "./layouts/DonationLayout";
import SponsorShipPage from "./pages/SponsorShipPage";
import ManagerMainLayout from "./layouts/ManagerMainLayout";
import ManagerMainPage from "./pages/manager/ManagerMainPage";
import ManagerVolunteerPage from "./pages/manager/ManagerVolunteerPage";
import DogDetailPage from "./pages/DogDetailPage";
import My from "./pages/My";
import SignUp from "./pages/SignUp";
import NaverCallback from "./pages/NaverCallback";
import ManagerEmergencyPage from "./pages/manager/ManagerEmergencyPage";
import DogCommentsPage from "./pages/DogCommentsPage";
import AdoptionNoticePage from "./pages/AdoptionNoticePage";
import DogRegisterPage from "./pages/manager/DogRegisterPage";
import VolunteerSchedulePage from "./pages/VolunteerSchedulePage";
import AddVolunteerSchedulePage from "./pages/manager/AddVolunteerSchedulePage";
import EmergencyRegisterPage from "./pages/manager/EmergencyRegisterPage";
import VolunteerDetailPage from "./pages/VolunteerDetailPage";
import VolunteerApplyPage from "./pages/VolunteerApplyPage";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CenterProtectedRoute from "./components/auth/CenterProtectedRoute";
import CenterMemberProtectedRoute from "./components/auth/CenterMemberProtectedRoute";
import DogManageMainPage from "./pages/manager/DogManageMainPage";
import ManagerDogListPage from "./pages/manager/ManagerDogListPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <NotFoundPage />,
		element: (
			<CenterProtectedRoute>
				<MainLayout />
			</CenterProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <Home />,
			},
			{
				path: "login",
				children: [
					{
						index: true,
						element: (
							<AuthenticatedRoute>
								<Login />
							</AuthenticatedRoute>
						),
					},
					{
						path: "callback",
						element: (
							<AuthenticatedRoute>
								<NaverCallback />
							</AuthenticatedRoute>
						),
					},
				],
			},
			{
				path: "signup",
				element: (
					<AuthenticatedRoute>
						<SignUp />
					</AuthenticatedRoute>
				),
			},
			{
				path: "my",
				element: (
					<ProtectedRoute>
						<My />
					</ProtectedRoute>
				),
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
						children: [
							{
								index: true,
								element: <DogDetailPage />,
							},
							{
								path: "comments",
								element: (
									<CenterMemberProtectedRoute>
										<DogCommentsPage />
									</CenterMemberProtectedRoute>
								),
								handle: { showHeader: false },
							},
						],
					},
				],
			},
			{
				path: "adoption",
				children: [
					{
						path: "notice",
						element: (
							<ProtectedRoute>
								<CenterMemberProtectedRoute>
									<AdoptionNoticePage />
								</CenterMemberProtectedRoute>
							</ProtectedRoute>
						),
					},
				],
			},
			{
				path: "volunteer",
				children: [
					{
						index: true,
						element: <VolunteerSchedulePage />,
					},
					{
						path: ":id",
						children: [
							{
								index: true,
								element: <VolunteerDetailPage />,
							},
							{
								path: "apply",
								element: (
									<ProtectedRoute>
										<CenterMemberProtectedRoute>
											<VolunteerApplyPage />
										</CenterMemberProtectedRoute>
									</ProtectedRoute>
								),
							},
						],
					},
				],
			},
		],
	},
	{
		path: "/manager",
		errorElement: <NotFoundPage />,
		element: <ManagerMainLayout />,
		children: [
			{
				index: true,
				element: <ManagerMainPage />,
			},
			{
				path: "volunteer",
				children: [
					{
						index: true,
						element: <ManagerVolunteerPage />,
						handle: { showHeader: false },
					},
					{
						path: "create",
						element: <AddVolunteerSchedulePage />,
						handle: { showHeader: false },
					},
				],
			},
			{
				path: "dog-register",
				element: <DogRegisterPage />,
				handle: { showHeader: false },
			},
			{
				path: "emergency",
				handle: { showHeader: false },
				children: [
					{
						index: true,
						element: <ManagerEmergencyPage />,
					},
					{
						path: "register",
						element: <EmergencyRegisterPage />,
					},
				],
			},
			{
				path: "dog-management",
				element: <DogManageMainPage />,
			},
			{
				path: "dog-list",
				element: <ManagerDogListPage />,
			},
		],
	},
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DonationLayout from "./layouts/DonationLayout";
import SponsorShipPage from "./pages/SponsorShipPage";
import ManagerMainLayout from "./layouts/ManagerMainLayout";
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
import NotFoundPage from "./pages/NotFoundPage";
import CenterDecisionPage from "./pages/CenterDecisionPage";
import CenterLayout from "./layouts/CenterLayout";
import DogDrugsPage from "./pages/manager/DogDrugsPage";
import ClosedVolunteerListPage from "./pages/ClosedVolunteerListPage";
import CenterManagerMainPage from "./pages/manager/CenterManagerMainPage";
import VaccinationDetailPage from "./pages/manager/VaccinationDetailPage";
import DogListPage from "./pages/DogListPage";
import AdoptionManagerMainPage from "./pages/manager/AdoptionManagerMainPage";
import FosterManagerMainPage from "./pages/manager/FosterManagerMainPage";
import PostListPage from "./pages/PostListPage";
import PostCreatePage from "./pages/manager/PostCreatePage";
import BazaarPage from "./pages/BazaarPage";
import BazaarDetailPage from "./pages/BazaarDetailPage";
import BazaarNewPage from "./pages/BazaarNewPage";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import ProfileEdit from "./components/my/ProfileEdit";
import PostTypeCreatePage from "./pages/PostTypeCreatePage";
import PostEditPage from "./pages/PostEditPage";
import CenterManagerProtectedRoute from "./components/auth/CenterManagerProtectedRoute";
import VolunteerEditPage from "./pages/VolunteerEditPage";
import FilteredPostListByDogId from "./components/dog/FilteredPostListByDogId";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <NotFoundPage />,
		element: <MainLayout />,
		children: [
			{
				element: (
					<ProtectedRoute>
						<CenterProtectedRoute>
							<CenterLayout />
						</CenterProtectedRoute>
					</ProtectedRoute>
				),
				children: [
					{
						index: true,
						element: <Home />,
					},

					{
						path: "my",
						element: <My />,
					},
					{
						path: "my/edit",
						element: <ProfileEdit />,
						handle: { showHeader: false },
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
						path: "bazaar",
						children: [
							{
								index: true,
								element: <BazaarPage />,
							},
							{
								path: "new",
								element: (
									<CenterMemberProtectedRoute>
										<BazaarNewPage />
									</CenterMemberProtectedRoute>
								),
								handle: { showHeader: false },
							},
							{
								path: ":id",
								element: <BazaarDetailPage />,
								handle: { showHeader: false },
							},
						],
					},
					{
						path: "posts",
						children: [
							{
								index: true,
								element: <PostListPage />,
								handle: { showHeader: false },
							},
							{
								path: "create",
								element: <PostCreatePage />,
								handle: { showHeader: false },
							},
							{
								path: "edit/:id",
								element: <PostEditPage />,
								handle: { showHeader: false },
							},
							{
								path: ":id",
								element: <AnnouncementDetailPage />,
								handle: { showHeader: false },
							},
						],
					},
					{
						path: "post",
						children: [
							{
								path: ":id",
								element: <AnnouncementDetailPage />,
								handle: { showHeader: false },
							},
							{
								path: "type-create",
								element: <PostTypeCreatePage />,
								handle: { showHeader: false },
							},
						],
					},
					{
						path: "dogs",
						children: [
							{
								index: true,
								element: <DogListPage />,
							},
							{
								path: ":id",
								children: [
									{
										index: true,
										element: <DogDetailPage />,
										handle: { showHeader: false },
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
									{
										path: "adoption",
										children: [
											{
												path: "notice",
												element: (
													<CenterMemberProtectedRoute>
														<AdoptionNoticePage />
													</CenterMemberProtectedRoute>
												),
												handle: { showHeader: false },
											},
										],
									},
									{
										path: "posts",
										element: <FilteredPostListByDogId />,
										handle: { showHeader: false },
									},
								],
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
										handle: { showHeader: false },
									},
									{
										path: "apply",
										element: (
											<CenterMemberProtectedRoute>
												<VolunteerApplyPage />
											</CenterMemberProtectedRoute>
										),
										handle: { showHeader: false },
									},
									{
										path: "edit",
										element: (
											<CenterManagerProtectedRoute>
												<VolunteerEditPage />
											</CenterManagerProtectedRoute>
										),
										handle: { showHeader: false },
									},
								],
							},
							{
								path: "closed",
								element: <ClosedVolunteerListPage />,
							},
						],
					},
				],
			},
			{
				path: "/manager",
				errorElement: <NotFoundPage />,
				element: (
					<CenterManagerProtectedRoute>
						<CenterProtectedRoute>
							<ManagerMainLayout />
						</CenterProtectedRoute>
					</CenterManagerProtectedRoute>
				),
				children: [
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
								element: (
									<CenterMemberProtectedRoute>
										<EmergencyRegisterPage />
									</CenterMemberProtectedRoute>
								),
							},
						],
					},
					{
						path: "dog-management",
						handle: { showHeader: false },
						children: [
							{
								index: true,
								element: <DogManageMainPage />,
							},
							{
								path: "drugs",
								element: <DogDrugsPage />,
							},
							{
								path: "vaccination",
								children: [
									{
										path: ":id",
										children: [
											{
												index: true,
												element: (
													<VaccinationDetailPage />
												),
												handle: { showHeader: false },
											},
										],
									},
								],
							},
						],
					},
					{
						path: "center",
						element: <CenterManagerMainPage />,
						handle: { showHeader: false },
					},
					{
						path: "adoption",
						element: <AdoptionManagerMainPage />,
						handle: { showHeader: false },
					},
					{
						path: "foster",
						element: <FosterManagerMainPage />,
						handle: { showHeader: false },
					},
				],
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
				path: "center-decision",
				element: (
					<ProtectedRoute>
						<CenterDecisionPage />
					</ProtectedRoute>
				),
			},
		],
	},
]);

export default router;

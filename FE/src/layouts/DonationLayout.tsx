import { Link, Outlet } from "react-router-dom";

export default function DonationLayout() {
	return (
		<>
			<div className="flex border-b border-lightGray">
				<Link to="/donations">
					<div className="relative flex flex-col justify-center items-center h-full">
						<span className="font-bold pb-2.5 px-4 border-b-2 border-primary">
							결연
						</span>
					</div>
				</Link>
				<Link to="/donations">
					<div className="relative flex flex-col justify-center items-center h-full">
						<span className="font-bold pb-2.5 px-4 text-lightGray">
							물품 후원
						</span>
					</div>
				</Link>
				<Link to="/donations">
					<div className="relative flex flex-col justify-center items-center h-full">
						<span className="font-bold pb-2.5 px-4 text-lightGray">
							바자회
						</span>
					</div>
				</Link>
			</div>
			<Outlet />
		</>
	);
}

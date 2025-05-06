import { Link } from "react-router-dom";

export default function DogManageMainPage() {
	return (
		<div className="flex flex-col gap-2.5 mx-2.5 text-grayText">
			<div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-custom-sm p-4 gap-4">
				<img
					src="/src/assets/images/dogs.png"
					alt="dogs"
					className="w-[70%]"
				/>
				<Link
					to="/manager/dog-list"
					className="w-full rounded-full py-1 bg-superLightBlueGray text-lg font-semibold text-center hover:bg-superLightGray"
				>
					아이들 전체보기
				</Link>
			</div>
			<div className="flex gap-2.5 h-52">
				<div className="flex flex-col flex-1 bg-white rounded-lg shadow-custom-sm p-4 justify-center items-center">
					<img
						src="/src/assets/images/dog.png"
						alt="dog"
						className="w-[70%]"
					/>
					<Link
						to="/manager/dog-register"
						className="w-full rounded-full py-1 bg-superLightBlueGray text-lg font-semibold text-center hover:bg-superLightGray"
					>
						아이 등록
					</Link>
				</div>
				<div className="flex flex-col flex-1 bg-white rounded-lg shadow-custom-sm p-4 justify-center items-center">
					<img
						src="/src/assets/images/pills.svg"
						alt="pills"
						className="w-[70%]"
					/>
					<Link
						to="button"
						className="w-full rounded-full py-1 bg-superLightBlueGray text-lg font-semibold text-center hover:bg-superLightGray"
					>
						복약 필요한 아이들
					</Link>
				</div>
			</div>
		</div>
	);
}

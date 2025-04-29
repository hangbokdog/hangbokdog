import MileageCard from "@/components/my/MileageCard";
import Profile from "@/components/my/Profile";
import Order from "@/components/my/Order";
import ProtectDogPanel from "@/components/my/ProtectDogPanel";

function handleEdit() {
	//프로필 수정 로직
}

export default function My() {
	return (
		<div>
			<Profile
				name="멜롱"
				email="min@naver.com"
				onEdit={() => {
					handleEdit();
					console.log("프로필 수정 클릭됨");
				}}
			/>
			<div className="max-w-[382px] grid grid-cols-2 gap-3">
				<div className="w-[185px] h-[165px]">
					<MileageCard />
				</div>
				<div className="w-[185px] h-[165px]">
					<MileageCard />
				</div>
			</div>
			<div>
				<Order />
			</div>
			<div>
				<ProtectDogPanel />
			</div>
		</div>
	);
}
/*
function handleEdit(){
	
}
*/

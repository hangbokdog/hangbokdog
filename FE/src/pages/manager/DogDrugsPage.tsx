import Search from "@/components/common/filter/Search";
import DogDrugsPanel from "@/components/manager/dogs/DogDrugsPanel";

export default function DogDrugsPage() {
	return (
		<div className="mx-2.5">
			<Search />
			<div className="text-xl font-bold text-grayText text-center my-4">
				복약이 필요한 아이를 선택해주세요!
			</div>
			<DogDrugsPanel />
		</div>
	);
}

import dog1 from "@/assets/images/dog1.png";
import DogImage from "@/components/dog/DogImage";
import DogHeader from "@/components/dog/DogHeader";
import DogStatus from "@/components/dog/DogStatus";
import DogInfoCard from "@/components/dog/DogInfoCard";
import DogInfoItem from "@/components/dog/DogInfoItem";
import DogGridInfoItem from "@/components/dog/DogGridInfoItem";
import DogActionButtons from "@/components/dog/DogActionButtons";
import DogSponsors from "@/components/dog/DogSponsors";

const sponsors = [
	{
		id: 1,
		name: "최준혁",
	},
	{
		id: 2,
		name: "김민지",
	},
];

export default function DogDetailPage() {
	return (
		<div className="flex flex-col">
			<DogImage src={dog1} alt="dog1" />
			<div className="flex flex-col p-2.5 gap-3">
				<DogHeader name="뽀동" age="2개월" likes={4} comments={2} />
				<DogStatus status="보호중" gender="여아" />
				<DogSponsors sponsors={sponsors} />
				<DogInfoCard title="견적사항">
					<div className="grid grid-cols-2">
						<DogGridInfoItem label="종" value="말티즈" />
						<DogGridInfoItem label="색상" value="연갈/흰" />
					</div>
					<div className="grid grid-cols-2">
						<DogGridInfoItem label="무게" value="5.3 kg" />
						<DogGridInfoItem label="중성화" value="X" />
					</div>
					<DogInfoItem label="특이사항" value="5.3 kg" />
				</DogInfoCard>
				<DogInfoCard title="기타">
					<DogInfoItem label="구조일시" value="2025년 4월 22일" />
					<DogInfoItem
						label="발견장소"
						value="경기 파주시 문산읍 당동리 948"
					/>
					<DogInfoItem label="보호소" value="파주 보호소" />
				</DogInfoCard>
				<DogInfoCard title="복약정보">
					<DogInfoItem label="투약일시" value="2025년 4월 23일" />
					<DogInfoItem
						label="투약정보"
						value="광견 인플 코로나 접종"
					/>
					<DogInfoItem label="특이사항" value="슬개골 탈구" />
				</DogInfoCard>
				<DogActionButtons
					sponsorLink="https://www.ihappynanum.com/Nanum/B/21G6PTU1W5?ltclid=6e37156f-0f73-4313-a7af-67fdd2ab06ce&fbclid=PAZXh0bgNhZW0CMTEAAadBxtRn2enWtLqH7SNGEL3WiZ4B7nTUy1REE0aTiW8ixFz2w2IT5PJPw9XdTg_aem_O_6bWU3kjURO35qBLOSEcA"
					adoptionLink="/"
				/>
			</div>
		</div>
	);
}

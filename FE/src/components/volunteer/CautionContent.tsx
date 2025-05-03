import CautionSection from "./CautionSection";

export default function CautionContent() {
	return (
		<div className="flex flex-col gap-3">
			<CautionSection
				title="안전사고 예방"
				items={[
					<span key="견사" className="text-grayText font-bold">
						- 견사 문단속 / 아이들 섞임 주의
					</span>,
					<span
						key="견사-설명"
						className="ml-2 text-grayText font-medium"
					>
						아이들 성향에 따라{" "}
						<span className="text-pink">
							오전 / 오후 / 견사 내부/ 외부로 운동조를 나누어 둔
							상태
						</span>
						입니다. 청소, 운동, 교대 시 잘못 섞일 경우 대 인 대견
						물림 사고가 날 수 있어요.{" "}
						<span className="font-bold">견사 청소 시</span> 문단속에
						신경 써 주시고,{" "}
						<span className="font-bold">교대 시간에는</span>{" "}
						<span className="text-pink">직원만</span> 견사 문을 견사
						문을 열도록 합니다.
					</span>,
					<span key="담배" className="text-grayText font-bold">
						- 담배꽁초 주의
					</span>,
					<span
						key="담배-설명"
						className="ml-2 text-grayText font-medium"
					>
						보호소는
						<span className="text-pink">화재에 매우 취약</span>한
						장소입니다. 전체 금연 구역이므로 흡연은 바깥에서
						부탁드리며{" "}
						<span className="font-bold">견사 청소 시</span> 문단속에
						신경 써 주시고,{" "}
						<span className="text-pink">
							꽁초를 함부로 버리지 말아주 세요.
						</span>
					</span>,
					<span key="연령" className="text-grayText font-bold">
						- 만 24세 이상부터 봉사 가능
					</span>,
					<span
						key="연령-설명"
						className="ml-2 text-grayText font-medium"
					>
						안전 문제로 인하여 봉사 연령을 제한하고 있습니다.
						<br />만 20세 ~ 24세 미만은 스텝에게 문의해 주세요.
						<br />
						(부모님 동의서 필요)
					</span>,
				]}
			/>
			<CautionSection
				title="SNS 공유 시 주의사항"
				items={[
					<span key="sns-1" className="text-grayText font-medium">
						보호소의 위치가 공개되면 아이들을 몰래 유기하거나
						위협하는 일들이 발생합니다. 😣
					</span>,
					<span key="sns-2" className="text-grayText font-medium">
						주소 및 주변 건물 등{" "}
						<span className="text-pink">
							위치가 드러날 수 있는 사진은 업로드하지 않도록
						</span>{" "}
						주의 부탁드립니다.
					</span>,
				]}
			/>
			<CautionSection
				title="물품은 아껴서, 제자리에"
				items={[
					<span key="물품-1" className="text-grayText font-medium">
						보호소의 모든 물품은 여러분들의{" "}
						<span className="text-pink">소중한 후원품</span>이자
						<span className="text-pink">공동물품</span>입니다.
					</span>,
					<span key="물품-2" className="text-grayText font-medium">
						망가지지 않도록 조심스럽게 사용해 주시고, 사용 후
						유실되지 않게 제자리에 정리해 주세요.
					</span>,
				]}
			/>
			<CautionSection
				title="쓰레기 버리지 않기"
				items={[
					<span key="쓰레기-1" className="text-grayText font-medium">
						폐기물 처리에도 후원금이 사용됩니다.
					</span>,
					<span key="쓰레기-2" className="text-grayText font-medium">
						가져오신 방진복, 음료수병, 비닐 쓰레기, 종이 봉투 등을
						버리는 데에{" "}
						<span className="text-pink">
							후원금이 낭비되지 않도록
						</span>
						, 쓰레기는 다시 가져가 주시기를 부탁드립니다.
					</span>,
				]}
			/>
			<CautionSection
				title="봉사하는 마음을 지켜주세요"
				items={[
					<span key="마음-1" className="text-grayText font-medium">
						- 봉사는 나와의 약속이자{" "}
						<span className="text-pink">아이들과의 약속</span>
						입니다. 약속 시간을 꼭 지켜 주세요.
					</span>,
					<span key="마음-2" className="text-grayText font-medium">
						- 중대형견이 많은 보호소입니다. 짖는 소리도 크고 덩치도
						큰 아이들임을 감안해 주세요.
					</span>,
					<span key="마음-3" className="text-grayText font-medium">
						- 대소변 / 토사물 / 털 등을 더럽다 여기지 마시고,
						혼자서는 살아갈 수 없는 아이들을 돕는다는 마음으로
						봉사하러 와주세요.
					</span>,
				]}
			/>
		</div>
	);
}

import GuideSection from "./GuideSection";

export default function GuideContent() {
	return (
		<div className="flex flex-col gap-3">
			<GuideSection
				title="봉사 필수 자격"
				items={[
					"만 20세 이상이고, 심신이 건강하신 분",
					"동물을 사랑하며, 동물을 대하는 것이 두렵지 않은 분",
					"파상풍 예방 접종을 완료하신 분",
				]}
			/>
			<GuideSection
				title="봉사 시간"
				items={[
					<span key="time">
						<span className="font-bold">오전</span> 10:00 ~ 14:00 /{" "}
						<span className="font-bold">오후</span> 15:00 ~ 18:00
					</span>,
				]}
			/>
			<GuideSection
				title="봉사 범위"
				items={[
					"본관과 별채 중 한 곳을 맡아 봉사하시게 됩니다.",
					<span key="morning">
						<span className="font-bold">오전</span> 견사 청소, 이불
						및 패드 교체, 대소변 치우기, 설거지, 아이들과 놀아주기
					</span>,
					<span key="afternoon">
						<span className="font-bold">오후</span> 대소변 치우기,
						설거지, 아이들과 놀아주기, 바닥 청소 (17:30)
					</span>,
				]}
			/>
			<GuideSection
				title="점심식사 및 휴식 시간"
				items={[
					"14:00 ~ 15:00",
					"- 종일 봉사를 하실 경우 점심 도시락을 지참해 주세요!",
					"- 식사는 외부 테이블을 이용해 주세요.",
					"- 화장실은 본관과 별채 내부에서 이용 가능합니다.",
				]}
			/>
			<GuideSection
				title="필수 준비물"
				items={[
					"마실 물 / 음료, 긴 바지 착용, 개인용 물품* (방진복, 우비, 장화, 모자, 장갑, 도시락, 간식 등)",
					"* 개인용 물품의 경우, 보호소에서 제공할 수 없으므로 필요 시 지참하셔야 한다는 의미입니다. 🙏",
				]}
			/>
			<GuideSection
				title="5인 이상 단체 봉사 안내"
				items={[
					<span key="group">
						쉼뜰의 타임별{" "}
						<span className="font-bold">최대 인원은 6명</span>
						입니다. 그 이상의 단체 봉사는 쉼터로 신청 부탁드립니다.
					</span>,
				]}
			/>
			<GuideSection
				title="방송용 촬영 안내"
				items={[
					"사전 협의 없는 유튜브나 개인 방송 촬영 금지됩니다.",
					"* 보호소를 홍보하여 선한 영향력을 전하고자 하시는 분들께서 는 사전에 문의 주시면 감사하겠습니다.",
				]}
			/>
			<GuideSection
				title="담당 스텝"
				items={[
					"율댕 010-4324-0035",
					"* 생업이 있는 봉사자이므로 즉각적인 응대는 어려울 수 있습니 다. 문자 / 채팅으로만 연락 부탁드립니다. 🙏♥",
				]}
			/>
			<div className="flex flex-col gap-2">
				<span className="text-lg font-semibold text-day border-b border-day pb-1">
					기타 문의는
				</span>
				<div className="flex flex-col gap-1">
					<div className="flex">
						<button
							type="button"
							className="bg-lightGray text-white rounded-[8px] py-2 px-4"
						>
							1:1 문의하기
						</button>
					</div>
					<span className="text-grayText font-medium">
						✔️ 1365 봉사 시간은 부여되지 않습니다.
					</span>
				</div>
			</div>
		</div>
	);
}

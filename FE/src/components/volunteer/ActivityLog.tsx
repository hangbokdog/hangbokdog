import { useState } from "react";
import parse from "html-react-parser";

export default function ActivityLog() {
	const [logContent] = useState<string>(`
<h2>2024년 5월 20일 활동 일지</h2>
<p>오늘은 <strong>쉼터</strong>에서 다음과 같은 활동을 진행했습니다:</p>
<ul>
  <li>오전 8시부터 10시까지 개별 산책 진행</li>
  <li>11시 간식 및 약 복용 도움</li>
  <li>13시 점심 식사 준비 및 급여</li>
  <li>14시~16시 놀이터 청소 및 소독</li>
  <li>16시~17시 사회화 훈련 및 놀이 활동</li>
</ul>
<p><span style="color: #ff0000;"><strong>특이사항:</strong></span></p>
<p>1. 초코(3살 믹스)가 오늘 왼쪽 앞발을 약간 절뚝거리는 모습이 보였습니다. 산책 중 다친 것 같지는 않으나 계속 관찰이 필요합니다.</p>
<p>2. 멜롱이는 어제보다 식사량이 개선되었으며, 활동성도 증가했습니다.</p>
<p>3. 오늘 새로 입소한 루시(2살 말티즈)는 아직 환경에 적응 중이라 다른 아이들과 거리를 두고 있습니다.</p>
<hr />
<p><strong>다음 활동 계획:</strong></p>
<ol>
  <li>초코 발 상태 모니터링</li>
  <li>루시 적응 돕기 위한 개별 훈련 진행</li>
  <li>내일 예정된 방문객 맞이 준비</li>
</ol>
<p><em>담당 봉사자: 김철수</em></p>
<p><img src="https://example.com/images/shelter_activity.jpg" alt="활동 사진" width="400" /></p>
  `);

	return <>{parse(logContent)}</>;
}

export default function MemberStatisticsCard() {
	return (
		<div className="flex flex-col w-full h-full p-4 gap-3 rounded-3xl bg-white shadow-custom-xs">
			<div className="flex items-center gap-1 font-semibold text-sm">
				<span>나의 활동 내역</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
				>
					<rect x="4" y="10" width="3" height="10" rx="1" fill="#ef4444" />
					<rect x="10.5" y="6" width="3" height="14" rx="1" fill="#3b82f6" />
					<rect x="17" y="2" width="3" height="18" rx="1" fill="#10b981" />
				</svg>
			</div>
			
			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">봉사 횟수</span>
				<span className="text-xl font-extrabold text-blue-600 text-right">12회</span>
			</div>

			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">후원 금액</span>
				<span className="text-xl font-extrabold text-blue-600 text-right">200,000원</span>
			</div>
		</div>
	);
}
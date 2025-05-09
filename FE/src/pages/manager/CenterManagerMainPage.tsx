export default function CenterManagerMainPage() {
	return (
		<div className="mx-2.5 gap-4.5 flex flex-col">
			<div className="flex flex-col bg-white rounded-lg shadow-custom-sm p-4 text-grayText font-semibold">
				<div className="flex w-full justify-between items-center">
					<span>지역 추가</span>
					<button
						type="button"
						className="bg-male text-white rounded-full px-4 py-1 font-semibold"
					>
						추가
					</button>
				</div>
			</div>
		</div>
	);
}

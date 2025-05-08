const MedicalInfo = () => {
	const dummyrecords = [
		{ id: "1", description: "심장사상충 예방 중" },
		{ id: "2", description: "피부병 치료 필요" },
		{ id: "3", description: "관절 건강 관리 중" },
	];

	return (
		<div className="mt-8">
			<div className="bg-white rounded-2xl p-6">
				<h2 className="text-lg font-bold text-grayText mb-4">
					의료정보
				</h2>
				<ul className="space-y-6">
					{dummyrecords.map((record) => (
						<li key={record.id} className="flex items-start">
							<span className="text-[#4e5968] mr-2">•</span>
							<span className="text-[#1f1f1f]">
								{record.description}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default MedicalInfo;

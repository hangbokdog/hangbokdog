export default function ManagerEmergencyPanel() {
	return (
		<div>
			<div className="flex gap-2.5 items-center py-2">
				<div className="flex rounded-full w-6 h-6 bg-[var(--color-red)] overflow-hidden">
					<img
						src="/src/assets/images/3D Siren Light Model.png"
						className="w-6 h-6"
						alt="Emergency Icon"
					/>
				</div>
				<div className="text-lg font-bold text-grayText">긴급요청</div>
			</div>
		</div>
	);
}

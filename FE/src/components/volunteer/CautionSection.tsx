interface CautionSectionProps {
	title: string;
	items: React.ReactNode[];
}

export default function CautionSection({ title, items }: CautionSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-lg font-semibold text-pink border-b border-pink pb-1">
				{title}
			</span>
			<div className="flex flex-col gap-1">
				{items.map((item, index) => (
					<span
						key={`${title}-item-${
							// biome-ignore lint/suspicious/noArrayIndexKey: 배열 인덱스 키 사용
							index
						}`}
						className="text-grayText font-medium"
					>
						{item}
					</span>
				))}
			</div>
		</div>
	);
}

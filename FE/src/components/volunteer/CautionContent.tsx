import parse from "html-react-parser";

interface CautionContentProps {
	content?: string;
}

export default function CautionContent({ content }: CautionContentProps) {
	return (
		<div className="flex flex-col gap-5">
			{content ? (
				<div className="prose max-w-none">{parse(content)}</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					등록된 주의 사항이 없습니다.
				</div>
			)}
		</div>
	);
}

import parse from "html-react-parser";

interface GuideContentProps {
	content?: string;
}

export default function GuideContent({ content }: GuideContentProps) {
	return (
		<div className="flex flex-col gap-5">
			{content ? (
				<div className="prose max-w-none">{parse(content)}</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					등록된 봉사 안내가 없습니다.
				</div>
			)}
		</div>
	);
}

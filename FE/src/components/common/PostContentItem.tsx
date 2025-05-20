import parse from "html-react-parser";

interface PostContentItemProps {
	content?: string;
	noText?: string;
}

export default function PostContentItem({
	content,
	noText = "등록된 활동 일지가 없습니다.",
}: PostContentItemProps) {
	return (
		<div className="flex flex-col gap-5">
			{content ? (
				<div className="prose max-w-none ql-editor">
					{parse(content)}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">{noText}</div>
			)}
		</div>
	);
}

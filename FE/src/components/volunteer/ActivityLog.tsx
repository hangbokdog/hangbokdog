import parse from "html-react-parser";

interface ActivityLogProps {
	content?: string;
}

export default function ActivityLog({ content }: ActivityLogProps) {
	return (
		<div className="flex flex-col gap-5">
			{content ? (
				<div className="prose max-w-none">{parse(content)}</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					등록된 활동 일지가 없습니다.
				</div>
			)}
		</div>
	);
}

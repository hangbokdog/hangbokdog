import type React from "react";

interface EmptyStateProps {
	message: string;
	icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
	return (
		<div className="w-full py-8 flex flex-col items-center justify-center text-gray-500">
			{icon || (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-12 w-12 mb-2 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<title>빈 데이터 아이콘</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
					/>
				</svg>
			)}
			<p className="text-center">{message}</p>
		</div>
	);
}

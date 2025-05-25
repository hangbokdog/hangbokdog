import { Search, XCircle } from "lucide-react";

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
}

export const SearchBar = ({
	searchQuery,
	onSearchChange,
	onClearSearch,
}: SearchBarProps) => {
	return (
		<div className="relative">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<Search size={16} className="text-gray-400" />
			</div>
			<input
				type="text"
				placeholder="이름, 닉네임으로 검색..."
				className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			{searchQuery && (
				<button
					type="button"
					className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
					onClick={onClearSearch}
				>
					<XCircle size={16} />
				</button>
			)}
		</div>
	);
};

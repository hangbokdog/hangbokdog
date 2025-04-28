import { MdFilterAlt, MdSearch } from "react-icons/md";
import AISearch from "@/assets/images/AISearch.svg";

interface SearchProps {
	onClickAISearch: () => void;
	placeholder?: string;
	maxLength?: number;
	onSearch?: (query: string) => void;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search({
	onClickAISearch,
	placeholder = "검색어를 입력해주세요.",
	maxLength = 30,
	onSearch,
	value,
	onChange,
}: SearchProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && onSearch) {
			onSearch((e.target as HTMLInputElement).value);
		}
	};

	return (
		<div className="flex bg-white rounded-3xl shadow-custom-sm px-3 py-2 transition-all duration-200 hover:shadow-md">
			<input
				className="flex-1 outline-none"
				type="text"
				placeholder={placeholder}
				maxLength={maxLength}
				value={value}
				onChange={onChange}
				onKeyDown={handleKeyDown}
			/>
			<div className="flex items-center justify-center ml-2 border-l border-grayText pl-2 gap-1">
				<MdSearch
					className="text-grayText size-5 hover:text-primary transition-colors cursor-pointer"
					onClick={() => (onSearch && value ? onSearch(value) : null)}
				/>
				<MdFilterAlt className="text-grayText size-5 hover:text-primary transition-colors cursor-pointer" />
				<button
					onClick={onClickAISearch}
					className="cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
					type="button"
				>
					<img src={AISearch} alt="AISearch" className="size-5" />
				</button>
			</div>
		</div>
	);
}

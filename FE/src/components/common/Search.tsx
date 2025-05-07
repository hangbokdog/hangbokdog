import { MdFilterAlt, MdSearch } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import AISearch from "@/assets/images/AISearch.svg";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchProps {
	onClickAISearch?: () => void;
	placeholder?: string;
	maxLength?: number;
	onSearch?: (query: string) => void;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	filter?: boolean;
	ai?: boolean;
}

type FilterTab = "종" | "성별" | "나이" | "중성화" | "보호소" | "기타";

export default function Search({
	onClickAISearch,
	placeholder = "검색어를 입력해주세요.",
	maxLength = 30,
	onSearch,
	value,
	onChange,
	filter = true,
	ai = true,
}: SearchProps) {
	const [selectedTab, setSelectedTab] = useState<FilterTab>("종");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && onSearch) {
			onSearch((e.target as HTMLInputElement).value);
		}
	};

	const filterTabs: FilterTab[] = [
		"종",
		"성별",
		"나이",
		"중성화",
		"보호소",
		"기타",
	];

	const filterOptions = {
		종: [
			"말티즈",
			"치와와",
			"시츄",
			"비글",
			"보더콜리",
			"골든리트리버",
			"진도개",
		],
		성별: ["수컷", "암컷"],
		나이: ["0~3개월", "4~6개월", "7~12개월", "1~2년", "3~7년", "8년 이상"],
		중성화: ["완료", "미완료"],
		보호소: ["보호소1", "보호소2", "보호소3"],
		기타: ["믹스", "의료", "프로젝트 봉사"],
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
				<MdSearch className="text-grayText size-5 hover:text-primary transition-colors cursor-pointer" />
				{filter && (
					<Drawer>
						<DrawerTrigger>
							<MdFilterAlt className="text-grayText size-5 hover:text-primary transition-colors cursor-pointer" />
						</DrawerTrigger>
						<DrawerContent className="bg-white">
							<div className="mx-auto w-full max-w-[440px]">
								<DrawerHeader>
									<div className="flex items-center justify-between">
										<DrawerTitle className="text-lg">
											필터
										</DrawerTitle>
										<DrawerClose>
											<button
												type="button"
												className="p-1 hover:bg-background rounded-full transition-colors"
											>
												<IoClose className="size-6 text-superLightGray" />
											</button>
										</DrawerClose>
									</div>
									<div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
										{filterTabs.map((tab) => (
											<button
												key={tab}
												onClick={() =>
													setSelectedTab(tab)
												}
												className={cn(
													"whitespace-nowrap px-2 py-1 rounded-full text-sm",
													selectedTab === tab
														? "bg-primary text-white"
														: "text-grayText hover:bg-background",
												)}
												type="button"
											>
												{tab}
											</button>
										))}
									</div>
								</DrawerHeader>
								<div className="p-4">
									<div className="flex flex-wrap gap-2">
										{filterOptions[selectedTab].map(
											(option) => (
												<button
													key={option}
													className="px-3 py-1 rounded-full bg-gray-100 text-sm hover:bg-gray-200 transition-colors"
													type="button"
												>
													{option}
												</button>
											),
										)}
									</div>
								</div>
								<DrawerFooter className="flex-row justify-end gap-2">
									<DrawerClose>
										<button
											type="button"
											className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
										>
											초기화
										</button>
									</DrawerClose>
									<DrawerClose>
										<button
											type="button"
											className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
										>
											검색하기
										</button>
									</DrawerClose>
								</DrawerFooter>
							</div>
						</DrawerContent>
					</Drawer>
				)}
				{ai && (
					<button
						onClick={onClickAISearch}
						className="cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
						type="button"
					>
						<img src={AISearch} alt="AISearch" className="size-5" />
					</button>
				)}
			</div>
		</div>
	);
}

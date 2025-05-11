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
	DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
	type DogBreed,
	DogBreedLabel,
	type Gender,
	GenderLabel,
} from "@/types/dog";
import type { DogSearchRequest } from "@/api/dog";
import useManagerStore from "@/lib/store/managerStore";

interface SearchProps {
	onClickAISearch?: () => void;
	placeholder?: string;
	maxLength?: number;
	onSearch?: (query: string, filters: Partial<DogSearchRequest>) => void;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	filter?: boolean;
	ai?: boolean;
	currentFilter?: Partial<DogSearchRequest>;
	onFilterChange?: (filters: Partial<DogSearchRequest>) => void;
}

type FilterTab = "breed" | "gender" | "isNeutered" | "location";

export default function Search({
	onClickAISearch,
	placeholder = "검색어를 입력해주세요.",
	maxLength = 30,
	onSearch,
	value,
	onChange,
	filter = true,
	ai = true,
	currentFilter = {},
	onFilterChange,
}: SearchProps) {
	const [selectedTab, setSelectedTab] = useState<FilterTab>("breed");
	const { addressBook } = useManagerStore();
	const [tempFilter, setTempFilter] =
		useState<Partial<DogSearchRequest>>(currentFilter);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && onSearch) {
			onSearch((e.target as HTMLInputElement).value, tempFilter);
		}
	};

	const filterTabs: FilterTab[] = [
		"breed",
		"gender",
		"isNeutered",
		"location",
	];

	const handleFilterApply = () => {
		onFilterChange?.(tempFilter);
		onSearch?.(value || "", tempFilter);
	};

	const handleFilterReset = () => {
		setTempFilter({});
		onFilterChange?.({});
		onSearch?.(value || "", {});
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleOptionSelect = (key: keyof DogSearchRequest, value: any) => {
		setTempFilter((prev) => ({
			...prev,
			[key]: prev[key] === value ? undefined : value,
		}));
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
						<DrawerContent
							className="bg-white"
							aria-describedby="drawer-description"
						>
							<div className="mx-auto w-full max-w-[440px]">
								<DrawerHeader>
									<div className="flex items-center justify-between">
										<DrawerTitle className="text-lg">
											필터
										</DrawerTitle>
										<DrawerDescription
											id="drawer-description"
											className="sr-only"
										>
											필터 옵션을 선택하세요
										</DrawerDescription>
										<DrawerClose>
											<IoClose className="size-6 text-superLightGray" />
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
												{tab === "breed" && "종"}
												{tab === "gender" && "성별"}
												{tab === "isNeutered" &&
													"중성화"}
												{tab === "location" && "보호소"}
											</button>
										))}
									</div>
								</DrawerHeader>
								<div className="p-4">
									<div className="flex flex-wrap gap-2">
										{selectedTab === "breed" &&
											Object.entries(DogBreedLabel).map(
												([key, label]) => (
													<button
														key={key}
														onClick={() =>
															handleOptionSelect(
																"breed",
																key as DogBreed,
															)
														}
														className={cn(
															"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
															tempFilter.breed ===
																key
																? "bg-primary text-white"
																: "bg-gray-100",
														)}
														type="button"
													>
														{label}
													</button>
												),
											)}
										{selectedTab === "gender" &&
											Object.entries(GenderLabel).map(
												([key, label]) => (
													<button
														key={key}
														onClick={() =>
															handleOptionSelect(
																"gender",
																key as Gender,
															)
														}
														className={cn(
															"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
															tempFilter.gender ===
																key
																? "bg-primary text-white"
																: "bg-gray-100",
														)}
														type="button"
													>
														{label}
													</button>
												),
											)}
										{selectedTab === "isNeutered" && (
											<div className="flex gap-2">
												<button
													onClick={() =>
														handleOptionSelect(
															"isNeutered",
															true,
														)
													}
													className={cn(
														"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
														tempFilter.isNeutered ===
															true
															? "bg-primary text-white"
															: "bg-gray-100",
													)}
													type="button"
												>
													완료
												</button>
												<button
													onClick={() =>
														handleOptionSelect(
															"isNeutered",
															false,
														)
													}
													className={cn(
														"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
														tempFilter.isNeutered ===
															false
															? "bg-primary text-white"
															: "bg-gray-100",
													)}
													type="button"
												>
													미완료
												</button>
											</div>
										)}
										{selectedTab === "location" && (
											<div className="flex gap-2">
												{addressBook.length > 0 ? (
													addressBook.map(
														(address) => (
															<button
																key={address.id}
																onClick={() =>
																	handleOptionSelect(
																		"location",
																		address.addressName,
																	)
																}
																className={cn(
																	"px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors",
																	tempFilter.location ===
																		address.addressName
																		? "bg-primary text-white"
																		: "bg-gray-100",
																)}
																type="button"
															>
																{
																	address.addressName
																}
															</button>
														),
													)
												) : (
													<p className="text-sm text-gray-500 col-span-full">
														등록된 주소록이
														없습니다.
													</p>
												)}
											</div>
										)}
									</div>
								</div>
								<DrawerFooter className="flex-row justify-end gap-2">
									<DrawerClose>
										<button
											onClick={handleFilterReset}
											onKeyDown={(e) => {
												if (
													e.key === "Enter" ||
													e.key === " "
												) {
													handleFilterReset();
												}
											}}
											tabIndex={0}
											type="button"
											className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
										>
											초기화
										</button>
									</DrawerClose>
									<DrawerClose>
										<button
											type="button"
											onClick={handleFilterApply}
											className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
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

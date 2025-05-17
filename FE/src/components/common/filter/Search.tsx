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
	DrawerDescription,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { DogSearchRequest } from "@/api/dog";
import useManagerStore from "@/lib/store/managerStore";
import BreedFilter from "./BreedFilter";
import GenderFilter from "./GenderFilter";
import AgeFilter from "./AgeFilter";
import NeuteredFilter from "./NeuteredFilter";
import LocationFilter from "./LocationFilter";

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

type FilterTab = "breed" | "gender" | "age" | "isNeutered" | "location";

export default function Search({
	onClickAISearch,
	placeholder = "검색어를 입력해주세요.",
	maxLength = 30,
	onSearch,
	value,
	onChange,
	filter = true,
	// 기본으로 ai 비활성화
	ai = false,
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
		"age",
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
		setTempFilter((prev) => {
			if (key === "breed" || key === "locationId") {
				const currentValues = prev[key] || [];
				return {
					...prev,
					[key]: currentValues.includes(value)
						? currentValues.filter((v) => v !== value)
						: [...currentValues, value],
				};
			}
			return {
				...prev,
				[key]: prev[key] === value ? undefined : value,
			};
		});
	};

	const handleDateChange = (start?: string, end?: string) => {
		setTempFilter((prev) => ({
			...prev,
			start,
			end,
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
							className="bg-white min-h-[40%]"
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
												{tab === "age" && "나이"}
												{tab === "isNeutered" &&
													"중성화"}
												{tab === "location" && "보호소"}
											</button>
										))}
									</div>
								</DrawerHeader>
								<div className="p-4">
									{selectedTab === "breed" && (
										<BreedFilter
											selectedBreeds={
												tempFilter.breed || []
											}
											onSelect={(breed) =>
												handleOptionSelect(
													"breed",
													breed,
												)
											}
										/>
									)}
									{selectedTab === "gender" && (
										<GenderFilter
											selectedGender={tempFilter.gender}
											onSelect={(gender) =>
												handleOptionSelect(
													"gender",
													gender,
												)
											}
										/>
									)}
									{selectedTab === "age" && (
										<AgeFilter
											startDate={tempFilter.start}
											endDate={tempFilter.end}
											onDateChange={handleDateChange}
										/>
									)}
									{selectedTab === "isNeutered" && (
										<NeuteredFilter
											isNeutered={tempFilter.isNeutered}
											onSelect={(value) =>
												handleOptionSelect(
													"isNeutered",
													value,
												)
											}
										/>
									)}
									{selectedTab === "location" && (
										<LocationFilter
											selectedLocations={
												tempFilter.locationId || []
											}
											addressBook={addressBook}
											onSelect={(location) =>
												handleOptionSelect(
													"locationId",
													location,
												)
											}
										/>
									)}
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

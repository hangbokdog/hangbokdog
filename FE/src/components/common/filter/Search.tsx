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
import { useState, useEffect, useRef } from "react";
import type { DogSearchRequest } from "@/api/dog";
import BreedFilter from "./BreedFilter";
import GenderFilter from "./GenderFilter";
import AgeFilter from "./AgeFilter";
import NeuteredFilter from "./NeuteredFilter";
import LocationFilter from "./LocationFilter";
import { X } from "lucide-react";
import { DogBreedLabel } from "@/types/dog";

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

type FilterTab = "breed" | "gender" | "age" | "isNeutered" | "locationId";

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
	const [filterLabels, setFilterLabels] = useState<
		{ key: string; label: string; value: string }[]
	>([]);
	const [ageText, setAgeText] = useState<string>("");
	const getAge = (ageVariable: string) => {
		setAgeText(ageVariable);
	};

	// Keep tempFilter in sync with currentFilter
	const prevCurrentFilterRef = useRef(currentFilter);
	useEffect(() => {
		// Only update if currentFilter has actually changed
		if (
			JSON.stringify(prevCurrentFilterRef.current) !==
			JSON.stringify(currentFilter)
		) {
			setTempFilter(currentFilter);
			prevCurrentFilterRef.current = currentFilter;
		}
	}, [currentFilter]);

	useEffect(() => {
		const labels: { key: string; label: string; value: string }[] = [];

		if (currentFilter.breed?.length) {
			for (const breed of currentFilter.breed) {
				labels.push({
					key: `breed-${breed}`,
					label: "종",
					value: DogBreedLabel[breed],
				});
			}
		}

		// Handle gender filter
		if (currentFilter.gender) {
			labels.push({
				key: "gender",
				label: "성별",
				value: currentFilter.gender === "MALE" ? "남아" : "여아",
			});
		}

		// Handle age filter (start/end dates)
		if (currentFilter.start || currentFilter.end) {
			const ageLabel = [];
			ageLabel.push(ageText);
			labels.push({
				key: "age",
				label: "나이",
				value: ageLabel.join(" "),
			});
		}

		// Handle neutered filter
		if (currentFilter.isNeutered !== undefined) {
			labels.push({
				key: "isNeutered",
				label: "중성화",
				value: currentFilter.isNeutered ? "O" : "X",
			});
		}

		// Handle location filter
		if (currentFilter.locationId?.length) {
			const locationNames = currentFilter.locationId.map((id) => {
				const location = addressBook.find(
					(addr) => addr.id === Number(id),
				);
				return location?.addressName || String(id);
			});

			for (let i = 0; i < currentFilter.locationId.length; i++) {
				const id = currentFilter.locationId[i];
				labels.push({
					key: `location-${id}`,
					label: "보호소",
					value: locationNames[i] || String(id),
				});
			}
		}

		setFilterLabels(labels);
	}, [currentFilter, ageText, addressBook]);

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
		"locationId",
	];

	const handleFilterApply = () => {
		onFilterChange?.(tempFilter);
		onSearch?.(value || "", tempFilter);
	};

	const handleFilterReset = () => {
		setTempFilter({});
		setAgeText("");
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

	const removeFilter = (key: string) => {
		let newFilter = { ...currentFilter };

		if (key === "gender") {
			const { gender, ...rest } = newFilter;
			newFilter = rest;
		} else if (key === "age") {
			const { start, end, ...rest } = newFilter;
			setAgeText(""); // Clear age text when filter is removed
			newFilter = rest;
		} else if (key === "isNeutered") {
			const { isNeutered, ...rest } = newFilter;
			newFilter = rest;
		} else if (key.startsWith("breed-")) {
			const breed = key.replace("breed-", "");
			const updatedBreeds =
				newFilter.breed?.filter((b) => b !== breed) || [];

			if (updatedBreeds.length === 0) {
				const { breed, ...rest } = newFilter;
				newFilter = rest;
			} else {
				newFilter = { ...newFilter, breed: updatedBreeds };
			}
		} else if (key.startsWith("location-")) {
			const locationId = key.replace("location-", "");
			const updatedLocations =
				newFilter.locationId?.filter((id) => id !== locationId) || [];

			if (updatedLocations.length === 0) {
				const { locationId, ...rest } = newFilter;
				newFilter = rest;
			} else {
				newFilter = { ...newFilter, locationId: updatedLocations };
			}
		}

		// Apply the filter changes
		setTempFilter(newFilter); // Update tempFilter state directly
		onFilterChange?.(newFilter);
		onSearch?.(value || "", newFilter);
	};

	// Helper function to check if a filter is applied for a given tab
	const isFilterApplied = (tab: FilterTab): boolean => {
		switch (tab) {
			case "breed":
				return !!tempFilter.breed?.length;
			case "gender":
				return tempFilter.gender !== undefined;
			case "age":
				return (
					tempFilter.start !== undefined ||
					tempFilter.end !== undefined
				);
			case "isNeutered":
				return tempFilter.isNeutered !== undefined;
			case "locationId":
				return !!tempFilter.locationId?.length;
			default:
				return false;
		}
	};

	return (
		<div className="flex flex-col gap-2">
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
												<div
													key={tab}
													className="relative"
												>
													<button
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
														{tab === "breed" &&
															"종"}
														{tab === "gender" &&
															"성별"}
														{tab === "age" &&
															"나이"}
														{tab === "isNeutered" &&
															"중성화"}
														{tab === "locationId" &&
															"보호소"}
													</button>
													{/*이부분에 필터 적용된 필터 우측 상단에 빨간 점 표시 */}
													{isFilterApplied(tab) && (
														<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
													)}
												</div>
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
												selectedGender={
													tempFilter.gender
												}
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
												getAge={getAge}
											/>
										)}
										{selectedTab === "isNeutered" && (
											<NeuteredFilter
												isNeutered={
													tempFilter.isNeutered
												}
												onSelect={(value) =>
													handleOptionSelect(
														"isNeutered",
														value,
													)
												}
											/>
										)}
										{selectedTab === "locationId" && (
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
							<img
								src={AISearch}
								alt="AISearch"
								className="size-5"
							/>
						</button>
					)}
				</div>
			</div>

			{filterLabels.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{filterLabels.map((item) => (
						<div
							key={item.key}
							className="flex items-center bg-primary/10 text-primary text-sm rounded-full px-2 py-1"
						>
							<span className="mr-1 font-medium">
								{item.label}:
							</span>
							<span>{item.value}</span>
							<button
								type="button"
								onClick={() => removeFilter(item.key)}
								className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
							>
								<X size={14} />
							</button>
						</div>
					))}
					{filterLabels.length > 1 && (
						<button
							type="button"
							onClick={handleFilterReset}
							className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
						>
							전체 초기화
						</button>
					)}
				</div>
			)}
		</div>
	);
}

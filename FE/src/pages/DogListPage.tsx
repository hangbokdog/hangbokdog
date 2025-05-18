import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import DogCard from "@/components/common/DogCard";
import Search from "@/components/common/filter/Search";
import AISearchPanel from "@/components/common/AISearchPanel";
import ScrollButton from "@/components/common/ScrollButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type DogSearchRequest, fetchDogsAPI } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { useNavigationType } from "react-router-dom";

export default function DogListPage() {
	const topRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<HTMLDivElement>(null);
	const [showImageSearch, setShowImageSearch] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const { selectedCenter } = useCenterStore();
	const [showStar, setShowStar] = useState(false);
	const [filters, setFilters] = useState<Partial<DogSearchRequest>>({});
	const SESSION_KEY = "dogListState";
	const navigationType = useNavigationType();
	const isInitialMount = useRef(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const filter = useMemo<DogSearchRequest>(
		() => ({
			centerId: selectedCenter?.centerId || "",
			name: debouncedSearchQuery || undefined,
			isStar: showStar,
			...filters,
		}),
		[selectedCenter?.centerId, debouncedSearchQuery, showStar, filters],
	);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery({
		queryKey: ["dogs", filter],
		queryFn: fetchDogsAPI,
		getNextPageParam: (lastPage) => lastPage.pageToken || undefined,
		initialPageParam: null,
		enabled: !!filter.centerId,
	});

	useEffect(() => {
		if (!observerRef.current || !hasNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					fetchNextPage().catch((err) => {
						console.error("Failed to fetch next page:", err);
					});
				}
			},
			{ threshold: 0.1 },
		);

		const currentObserver = observerRef.current;
		observer.observe(currentObserver);

		return () => {
			if (currentObserver) {
				observer.unobserve(currentObserver);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const toggleImageSearch = useCallback(() => {
		setIsAnimating(true);
		setTimeout(() => {
			setShowImageSearch((prev) => !prev);
			setIsAnimating(false);
		}, 150);
	}, []);

	const handleSearch = useCallback(
		(query: string, newFilters: Partial<DogSearchRequest>) => {
			setSearchQuery(query);
			setFilters(newFilters);
		},
		[],
	);

	const handleFilterChange = useCallback(
		(newFilters: Partial<DogSearchRequest>) => {
			setFilters(newFilters);
		},
		[],
	);

	const handleFileSelect = (file: File) => {
		console.log("선택된 파일:", file.name);
	};

	const dogs = data?.pages.flatMap((page) => page.data) || [];

	const restoreState = useCallback(() => {
		const savedState = sessionStorage.getItem(SESSION_KEY);
		console.log("savedState", savedState);
		if (!savedState) return;

		const { scrollY, searchState } = JSON.parse(savedState);
		console.log("Restoring scroll position:", scrollY);

		setSearchQuery(searchState.searchQuery);
		setDebouncedSearchQuery(searchState.debouncedSearchQuery);
		setShowStar(searchState.showStar);
		setFilters(searchState.filters);

		// 스크롤 복원은 데이터 로딩 후에 수행
		if (!isLoading && dogs.length > 0) {
			// 바로 스크롤 복원 시도
			window.scrollTo(0, scrollY);

			// 스크롤이 제대로 되지 않을 경우를 대비해 약간의 지연 후 다시 시도
			setTimeout(() => {
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollTop = scrollY;
				}
			}, 100);
		} else {
			// 데이터가 아직 로딩 중이면 데이터 로딩 완료 후 스크롤 복원
			const checkElements = setInterval(() => {
				if (dogs.length > 0) {
					if (scrollContainerRef.current) {
						scrollContainerRef.current.scrollTop = scrollY;
					}

					clearInterval(checkElements);
				}
			}, 50);
		}
	}, [isLoading, dogs.length]);

	const saveState = useCallback(() => {
		const scrollPosition = scrollContainerRef.current?.scrollTop ?? 0;

		console.log("Saving scroll position:", scrollPosition);

		const stateToSave = {
			scrollY: scrollPosition,
			searchState: {
				searchQuery,
				debouncedSearchQuery,
				showStar,
				filters,
			},
		};

		sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
	}, [searchQuery, debouncedSearchQuery, showStar, filters]);

	useEffect(() => {
		if (!isInitialMount.current) return;

		if (navigationType === "POP") {
			restoreState();
		}
		isInitialMount.current = false;
	}, [navigationType, restoreState]);

	return (
		<div className="relative flex flex-col">
			<div className="flex flex-col px-2.5 pt-2.5 gap-3 sticky top-0 bg-white z-10 pb-2">
				<div
					className={`transition-all duration-300 ${
						isAnimating
							? "opacity-0 scale-95"
							: "opacity-100 scale-100"
					}`}
				>
					{!showImageSearch ? (
						<Search
							onClickAISearch={toggleImageSearch}
							placeholder="아이의 이름을 입력해주세요."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onSearch={handleSearch}
							currentFilter={filters}
							onFilterChange={handleFilterChange}
						/>
					) : (
						<AISearchPanel
							onClose={toggleImageSearch}
							onFileSelect={handleFileSelect}
							title="이미지로 강아지 검색"
						/>
					)}
				</div>
				<div className="flex items-center justify-between">
					<span ref={topRef} className="font-bold text-grayText">
						별이 된 아이들 표시
					</span>
					<button
						type="button"
						className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
							showStar ? "bg-main" : "bg-gray-300"
						}`}
						onClick={() => setShowStar(!showStar)}
					>
						<div
							className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
								showStar ? "translate-x-6" : "translate-x-0"
							}`}
						/>
					</button>
				</div>
			</div>
			<div ref={scrollContainerRef} className="mx-2.5">
				{isLoading ? (
					<div className="max-w-[420px] grid grid-cols-2 gap-2.5">
						{[...Array(6)].map((_, i) => (
							<div
								key={`skeleton-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									i
								}`}
								className="h-40 bg-gray-100 rounded-lg animate-pulse"
							/>
						))}
					</div>
				) : error ? (
					<div className="flex flex-col items-center gap-2 py-4">
						<p className="text-red-500">
							에러: {(error as Error).message}
						</p>
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-main text-white rounded-lg"
						>
							다시 시도
						</button>
					</div>
				) : dogs.length === 0 ? (
					<div className="flex justify-center py-8 text-gray-500">
						결과가 없습니다.
					</div>
				) : (
					<>
						<div className="max-w-[420px] grid grid-cols-2 gap-2.5">
							{dogs.map((dog) => (
								<DogCard
									key={`${dog.dogId}-${dog.name}`}
									dogId={dog.dogId}
									name={dog.name}
									ageMonth={dog.ageMonth.toString()}
									imageUrl={dog.imageUrl}
									gender={dog.gender as "MALE" | "FEMALE"}
									isFavorite={dog.isFavorite}
									bgColor="bg-white"
									savePrevState={saveState}
								/>
							))}
						</div>
						{hasNextPage && (
							<div
								ref={observerRef}
								className="h-5 flex items-center justify-center text-gray-500 text-sm"
							>
								{isFetchingNextPage
									? "다음 페이지 로딩 중..."
									: ""}
							</div>
						)}
					</>
				)}
			</div>
			<ScrollButton />
		</div>
	);
}

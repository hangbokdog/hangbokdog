import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import DogCard from "@/components/common/DogCard";
import { adoptionSearchAPI } from "@/api/adoption";
import useCenterStore from "@/lib/store/centerStore";
import { Loader2 } from "lucide-react";

interface AdoptedDogsGridProps {
	searchQuery: string;
}

export default function AdoptedDogsGrid({ searchQuery }: AdoptedDogsGridProps) {
	const { selectedCenter } = useCenterStore();
	const observerRef = useRef<HTMLDivElement | null>(null);
	const prevSearchQuery = useRef(searchQuery);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["adoptedDogs", selectedCenter?.centerId, searchQuery],
		queryFn: async ({ pageParam }) => {
			return adoptionSearchAPI({
				centerId: Number(selectedCenter?.centerId),
				name: searchQuery || undefined,
				pageToken: pageParam,
			});
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		initialPageParam: undefined as string | undefined,
		enabled: !!selectedCenter?.centerId,
	});

	useEffect(() => {
		if (prevSearchQuery.current !== searchQuery) {
			refetch();
			prevSearchQuery.current = searchQuery;
		}
	}, [searchQuery, refetch]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage
				) {
					fetchNextPage();
				}
			},
			{ threshold: 0.5 },
		);

		const currentObserverRef = observerRef.current;

		if (currentObserverRef) {
			observer.observe(currentObserverRef);
		}

		return () => {
			if (currentObserverRef) {
				observer.unobserve(currentObserverRef);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	if (isLoading) {
		return (
			<div className="py-10 flex flex-col items-center justify-center">
				<Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
				<p className="text-gray-500">데이터를 불러오는 중입니다...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 flex flex-col items-center justify-center">
				<p className="text-gray-700 font-medium">
					데이터를 불러오는 데 실패했습니다
				</p>
				<button
					type="button"
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
					onClick={() => refetch()}
				>
					다시 시도
				</button>
			</div>
		);
	}

	const allDogs = data?.pages.flatMap((page) => page.data) || [];

	if (allDogs.length === 0) {
		return (
			<p className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-400">
				입양된 강아지가 없습니다
			</p>
		);
	}

	return (
		<div className="mt-4">
			<div className="grid grid-cols-2 gap-3">
				{allDogs.map((dog) => (
					<DogCard
						key={dog.dogId}
						dogId={dog.dogId}
						name={dog.name}
						imageUrl={dog.imageUrl}
						gender={dog.gender}
						isFavorite={dog.isFavorite}
						ageMonth={dog.ageMonth.toString()}
						isManager={true}
					/>
				))}
			</div>

			{/* 무한 스크롤 로더 */}
			{hasNextPage && (
				<div ref={observerRef} className="py-4 flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
					) : (
						<span className="text-sm text-gray-400">
							스크롤하여 더 불러오기
						</span>
					)}
				</div>
			)}
		</div>
	);
}

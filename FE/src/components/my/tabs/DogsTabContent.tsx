import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import MyDogCard from "@/components/my/MyDogCard";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { type DogSearchResponse, fetchMyFavoriteDogsAPI } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { Loader2 } from "lucide-react";
import type { PageInfo } from "@/api/http-commons";
import { calAge } from "@/utils/calAge";
import { fetchMyFostersAPI } from "@/api/foster";
import { fetchMyAdoptionsAPI } from "@/api/adoption";

type DogTabType = "liked" | "protected" | "adopted";

export default function DogsTabContent() {
	const [activeTab, setActiveTab] = useState<DogTabType>("liked");
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	const renderEmptyState = (type: DogTabType) => {
		const messages = {
			liked: "아직 좋아요한 강아지가 없어요.\n마음에 드는 친구를 찾아보세요!",
			protected:
				"아직 임시보호 중인 강아지가 없어요.\n소중한 보호자가 되어주세요!",
			adopted:
				"아직 입양한 강아지가 없어요.\n평생 함께할 가족을 만들어보세요!",
		};

		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-gray-500 whitespace-pre-line">
					{messages[type]}
				</p>
			</div>
		);
	};

	const {
		data: likedDogs,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery<PageInfo<DogSearchResponse>>({
		queryKey: ["liked-dogs", selectedCenter?.centerId],
		queryFn: ({ pageParam }) =>
			fetchMyFavoriteDogsAPI(
				Number(selectedCenter?.centerId),
				pageParam as string | undefined,
			),
		getNextPageParam: (lastPage) =>
			lastPage.hasNext ? lastPage.pageToken : undefined,
		initialPageParam: undefined,
		enabled: activeTab === "liked" && !!selectedCenter?.centerId,
	});

	useEffect(() => {
		return () => {
			queryClient.invalidateQueries({
				queryKey: ["liked-dogs", selectedCenter?.centerId],
			});
		};
	}, [queryClient, selectedCenter?.centerId]);

	// Flatten dogs data
	const dogs = likedDogs?.pages.flatMap((page) => page.data) ?? [];

	const { data: protectedDogs } = useQuery({
		queryKey: ["protected-dogs", selectedCenter?.centerId],
		queryFn: () => fetchMyFostersAPI(),
		enabled: activeTab === "protected" && !!selectedCenter?.centerId,
	});

	const { data: adoptedDogs } = useQuery({
		queryKey: ["adopted-dogs", selectedCenter?.centerId],
		queryFn: () => fetchMyAdoptionsAPI(Number(selectedCenter?.centerId)),
		enabled: activeTab === "adopted" && !!selectedCenter?.centerId,
	});

	// Handle scroll for infinite loading
	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			if (
				scrollHeight - scrollTop <= clientHeight * 1.5 &&
				!isFetchingNextPage &&
				hasNextPage
			) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	const renderDogsList = () => {
		switch (activeTab) {
			case "liked":
				if (isLoading) {
					return (
						<div className="flex items-center justify-center h-40">
							<Loader2 className="w-8 h-8 text-male animate-spin" />
						</div>
					);
				}

				if (error) {
					return (
						<div className="flex flex-col items-center justify-center h-40 text-gray-500">
							<p>좋아요한 아이 목록을 불러오는데 실패했습니다.</p>
							<button
								type="button"
								onClick={() => window.location.reload()}
								className="mt-2 text-sm text-male hover:underline"
							>
								다시 시도
							</button>
						</div>
					);
				}

				if (dogs.length === 0) {
					return renderEmptyState("liked");
				}

				return (
					<div
						className="flex flex-col gap-3 p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
						onScroll={handleScroll}
					>
						{dogs.map((dog) => (
							<MyDogCard
								key={dog.dogId}
								id={dog.dogId}
								name={dog.name}
								age={calAge(dog.ageMonth).toString()}
								imageUrl={dog.imageUrl}
								gender={dog.gender}
							/>
						))}
						{isFetchingNextPage && (
							<div className="col-span-2 flex justify-center py-4">
								<Loader2 className="w-6 h-6 text-male animate-spin" />
							</div>
						)}
						{!hasNextPage && dogs.length > 0 && (
							<div className="col-span-2 text-center py-4 text-sm text-gray-500">
								마지막 아이입니다
							</div>
						)}
					</div>
				);

			case "protected":
				return (protectedDogs?.length ?? 0) > 0 ? (
					<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
						{protectedDogs?.map((dog) => (
							<MyDogCard
								key={dog.dogId}
								id={dog.dogId}
								name={dog.dogName}
								imageUrl={dog.profileImage}
								status={
									dog.status as
										| "PENDING"
										| "APPROVED"
										| "REJECTED"
										| "CANCELLED"
								}
								startDate={dog.startDate}
							/>
						))}
					</div>
				) : (
					renderEmptyState("protected")
				);

			case "adopted":
				return (adoptedDogs?.length ?? 0) > 0 ? (
					<div className="max-w-[400px] grid grid-rows-3 gap-2.5 pb-2.5">
						{adoptedDogs?.map((dog) => (
							<MyDogCard
								key={dog.dogId}
								id={dog.dogId}
								name={dog.dogName}
								imageUrl={dog.profileImage}
								status={
									dog.status as
										| "APPLIED"
										| "UNDER_REVIEW"
										| "REJECTED"
										| "ACCEPTED"
										| "REJECTED"
								}
								startDate={dog.startDate}
							/>
						))}
					</div>
				) : (
					renderEmptyState("adopted")
				);

			default:
				return null;
		}
	};

	return (
		<div>
			{/* Inner Dog Tabs */}
			<div className="flex gap-2 mb-4 px-2">
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "liked"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("liked")}
				>
					좋아요
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "protected"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("protected")}
				>
					임시보호
				</button>
				<button
					type="button"
					className={cn(
						"flex-1 text-sm py-2.5 font-medium rounded-full transition-colors",
						activeTab === "adopted"
							? "bg-male text-white shadow-sm"
							: "bg-gray-100 text-gray-600 hover:bg-gray-200",
					)}
					onClick={() => setActiveTab("adopted")}
				>
					입양
				</button>
			</div>

			{renderDogsList()}
		</div>
	);
}

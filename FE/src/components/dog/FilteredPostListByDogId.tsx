import { fetchPostsByDogIdAPI } from "@/api/post";
import PostItem from "@/components/post/PostItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { DogDetailResponse } from "@/api/dog";
import useCenterStore from "@/lib/store/centerStore";
import { fetchDogDetail } from "@/api/dog";

const formatDate = (dateStr: string): string => {
	if (!dateStr || Number.isNaN(Date.parse(dateStr))) return "알 수 없음";
	return new Date(dateStr).toISOString().split("T")[0];
};

const formatAge = (age: number | null | undefined): string => {
	if (age == null || Number.isNaN(age) || age < 0) return "알 수 없음";
	if (age >= 12) return `${Math.floor(age / 12)}살`;
	return `${age}개월`;
};

interface DogDetail {
	dogId: number;
	dogStatus: string;
	centerId: number;
	centerName: string;
	dogName: string;
	profileImageUrl: string;
	color: string;
	rescuedDate: string;
	weight: string;
	description: string;
	isStar: number;
	gender: string;
	isNeutered: string;
	breed: string;
	age: string;
	location: string;
	locationId: number;
	isLiked: boolean;
	favoriteCount: number;
	currentSponsorCount: number;
	dogCommentCount: number;
	medicationDate: string;
	medicationInfo: string;
	medicationNotes: string;
	comments: number;
}

const mapDogDetailResponseToDogDetail = (
	response: DogDetailResponse,
): DogDetail => ({
	dogId: response.dogId,
	dogStatus: response.dogStatus,
	centerId: response.centerId,
	centerName: response.centerName,
	dogName: response.dogName,
	profileImageUrl: response.profileImageUrl,
	color: response.color.join(", "),
	rescuedDate: response.rescuedDate,
	weight: `${response.weight} kg`,
	description: response.description || "없음",
	isStar: response.isStar ? 1 : 0,
	gender: response.gender,
	isNeutered: response.isNeutered ? "O" : "X",
	breed: response.breed,
	age: `${formatAge(response.age)}`,
	location: response.location || "알 수 없음",
	locationId: response.locationId,
	isLiked: response.isLiked,
	favoriteCount: response.favoriteCount,
	currentSponsorCount: response.currentSponsorCount,
	dogCommentCount: response.dogCommentCount,
	medicationDate: "정보 없음",
	medicationInfo: "정보 없음",
	medicationNotes: "없음",
	comments: 0,
});

export default function FilteredPostListByDogId() {
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();
	const { id } = useParams();
	const observerRef = useRef<HTMLDivElement | null>(null);

	const { data: dogDetail } = useQuery<DogDetail, Error>({
		queryKey: ["dogDetail", id, selectedCenter?.centerId],
		queryFn: () =>
			fetchDogDetail(Number(id), selectedCenter?.centerId || "").then(
				mapDogDetailResponseToDogDetail,
			),
		enabled:
			!!id && !Number.isNaN(Number(id)) && !!selectedCenter?.centerId,
	});

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["posts", id],
		queryFn: async ({ pageParam }) => {
			return fetchPostsByDogIdAPI(Number(id), pageParam);
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasNext ? lastPage.pageToken : undefined;
		},
		initialPageParam: undefined as string | undefined,
		enabled: !!id,
	});

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

	const handlePostClick = (id: number) => {
		navigate(`/posts/${id}`);
	};

	const allPosts = data?.pages.flatMap((page) => page.data) || [];

	return (
		<div className="p-4 max-w-xl mx-auto">
			<div className="px-1 pt-2 mb-2 text-xl font-bold text-gray-800 flex justify-between items-center">
				{dogDetail?.dogName} 게시글
			</div>
			{isLoading ? (
				<div className="flex justify-center items-center h-64">
					<Loader2 className="w-8 h-8 text-male animate-spin" />
				</div>
			) : isError ? (
				<div className="flex flex-col items-center justify-center mt-10">
					<p className="text-gray-600 mb-4">
						게시글을 불러오는데 실패했습니다.
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-4 py-2 bg-male text-white rounded-lg"
					>
						다시 시도
					</button>
				</div>
			) : allPosts.length === 0 ? (
				<p className="text-gray-500">게시글이 없습니다.</p>
			) : (
				<div className="flex flex-col">
					{allPosts.map((post) => (
						<PostItem
							key={post.postId}
							post={post}
							onClick={handlePostClick}
							className="py-3 px-3 text-left w-full border-b border-gray-300"
							compact={true}
						/>
					))}

					{/* 무한 스크롤 로더 */}
					{hasNextPage && (
						<div
							ref={observerRef}
							className="py-4 flex justify-center"
						>
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
			)}
		</div>
	);
}

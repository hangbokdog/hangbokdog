import { useEffect, useState } from "react";
import PostItem from "@/components/post/PostItem";
import type { PostSummaryResponse } from "@/api/post";
import { useNavigate } from "react-router-dom";
import localAxios from "@/api/http-commons";
import useCenterStore from "@/lib/store/centerStore";

export default function FilteredPostListByDogId() {
	const [posts, setPosts] = useState<PostSummaryResponse[]>([]);
	const [targetDogId, setTargetDogId] = useState<number | null>(null);
	const postTypeIds = [35, 36];
	const navigate = useNavigate();

	const { selectedCenter } = useCenterStore();
	const centerId = selectedCenter?.centerId;

	useEffect(() => {
		if (!centerId) return;

		const fetchAndFilterPosts = async () => {
			try {
				const listResponses = await Promise.all(
					postTypeIds.map((postTypeId) =>
						localAxios.get("/posts", {
							params: { centerId, postTypeId },
						}),
					),
				);

				const postSummaries: PostSummaryResponse[] =
					listResponses.flatMap((res) =>
						Array.isArray(res.data?.data) ? res.data.data : [],
					);

				if (postSummaries.length === 0) {
					setPosts([]);
					return;
				}

				const detailResponses = await Promise.all(
					postSummaries.map((summary) =>
						localAxios.get(`/posts/${summary.postId}`),
					),
				);

				const detailedPosts = detailResponses.map((res) => res.data);
				const dogIdToFilter = detailedPosts[0]?.dogId;
				setTargetDogId(dogIdToFilter);

				const filteredPostIds = detailedPosts
					.filter((post) => post.dogId === dogIdToFilter)
					.map((post) => post.postId);

				const filteredSummaries = postSummaries.filter((post) =>
					filteredPostIds.includes(post.postId),
				);

				setPosts(filteredSummaries);
			} catch (error) {
				console.error("게시글 필터링 중 오류 발생:", error);
			}
		};

		fetchAndFilterPosts();
	}, [centerId]); // ✅ centerId 변경될 때 다시 실행

	const handlePostClick = (id: number) => {
		navigate(`/posts/${id}`);
	};

	return (
		<div className="p-4 max-w-xl mx-auto">
			<div className="px-1 pt-2 mb-2 text-xl font-bold text-gray-800 flex justify-between items-center">
				게시글 전체보기
			</div>
			{posts.length === 0 ? (
				<p className="text-gray-500">게시글이 없습니다.</p>
			) : (
				<div className="flex flex-col">
					{posts.map((post) => (
						<PostItem
							key={post.postId}
							post={post}
							onClick={handlePostClick}
							className="py-3 px-3 text-left w-full border-b border-gray-300"
							compact={true}
						/>
					))}
				</div>
			)}
		</div>
	);
}

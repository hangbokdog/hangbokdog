import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	fetchAnnouncementDetailAPI,
	deleteAnnouncementAPI,
	type AnnouncementDetailResponse,
} from "@/api/announcement";
import { Loader2, Calendar, User, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import PostContentItem from "@/components/common/PostContentItem";
import useCenterStore from "@/lib/store/centerStore";

const formatDateWithDay = (dateString: string) => {
	const date = new Date(dateString);
	return format(date, "yyyy.MM.dd(E)", { locale: ko });
};

export default function AnnouncementDetailPage() {
	const { id } = useParams<{ id: string }>();
	const [announcement, setAnnouncement] =
		useState<AnnouncementDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();

	useEffect(() => {
		const fetchAnnouncementDetail = async () => {
			if (!id || !selectedCenter?.centerId) return;

			try {
				setLoading(true);
				const data = await fetchAnnouncementDetailAPI(
					Number(id),
					Number(selectedCenter?.centerId),
				);
				setAnnouncement(data);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch announcement:", err);
				setError("공지사항을 불러오는데 실패했습니다.");
			} finally {
				setLoading(false);
			}
		};

		fetchAnnouncementDetail();
	}, [id, selectedCenter?.centerId]);

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleDelete = async () => {
		if (!id || !window.confirm("정말 이 공지사항을 삭제하시겠습니까?"))
			return;

		try {
			setIsDeleting(true);
			await deleteAnnouncementAPI(Number(id));
			sessionStorage.setItem("announcement_refresh_needed", "true");
			navigate(-1);
		} catch (err) {
			console.error("Failed to delete announcement:", err);
			alert("공지사항 삭제에 실패했습니다.");
			setIsDeleting(false);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				<Loader2 className="w-8 h-8 text-male animate-spin" />
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-white">
				<p className="text-gray-600 mb-4">{error}</p>
				<button
					type="button"
					onClick={handleGoBack}
					className="px-4 py-2 bg-male text-white rounded-lg"
				>
					돌아가기
				</button>
			</div>
		);

	if (!announcement)
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				공지사항을 찾을 수 없습니다.
			</div>
		);

	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* 헤더 */}

			<div className="flex-1 w-full bg-white">
				<div className="bg-white overflow-hidden mb-4">
					{/* 제목 및 작성자 정보 */}
					<div className="p-4 border-b border-gray-100">
						<h2 className="flex justify-between text-xl font-bold mb-3">
							{announcement.title}
							<button
								type="button"
								onClick={handleDelete}
								disabled={isDeleting}
								className="text-red-500 p-2 rounded-full hover:bg-red-50"
							>
								{isDeleting ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Trash2 className="w-5 h-5" />
								)}
							</button>
						</h2>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								{announcement.authorImage ? (
									<img
										src={announcement.authorImage}
										alt={announcement.authorName}
										className="w-8 h-8 rounded-full mr-2"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
										<User className="w-4 h-4 text-gray-500" />
									</div>
								)}
								<span className="text-sm font-medium">
									{announcement.authorName}
								</span>
							</div>
							<div className="flex items-center text-sm text-gray-500">
								<Calendar className="w-4 h-4 mr-1" />
								<span>
									{formatDateWithDay(announcement.createdAt)}
								</span>
							</div>
						</div>
					</div>

					{/* 본문 내용 */}
					<div className="p-4 bg-white">
						<div className="prose max-w-none whitespace-pre-wrap mb-6">
							<PostContentItem
								content={announcement.content}
								noText="-"
							/>
						</div>

						{/* 이미지 */}
						{announcement.imageUrls &&
							announcement.imageUrls.length > 0 && (
								<div className="mt-6 space-y-4">
									{announcement.imageUrls.map(
										(url, index) => (
											<div
												key={url}
												className="rounded-lg overflow-hidden shadow-sm"
											>
												<img
													src={url}
													alt={`공지사항 이미지 ${index + 1}`}
													className="w-full h-auto"
												/>
											</div>
										),
									)}
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}

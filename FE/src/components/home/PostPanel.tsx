import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	fetchAnnouncementsAPI,
	type AnnouncementResponse,
} from "@/api/announcement";
import useCenterStore from "@/lib/store/centerStore";
import { ChevronRight, Loader2 } from "lucide-react";
import AnnouncementItem from "@/components/announcement/AnnouncementItem";

export default function PostPanel() {
	const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { selectedCenter } = useCenterStore();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAnnouncements = async () => {
			if (!selectedCenter?.centerId) return;

			setIsLoading(true);
			setError(null);
			try {
				const response = await fetchAnnouncementsAPI(
					Number(selectedCenter.centerId),
				);
				setAnnouncements(response.data.slice(0, 5));
			} catch (err) {
				console.error("공지사항을 불러오는데 실패했습니다.", err);
				setError("공지사항을 불러오는데 실패했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnnouncements();
	}, [selectedCenter]);

	const handleAnnouncementClick = (id: number) => {
		navigate(`/announcements/${id}`);
	};

	const handleViewAllClick = () => {
		navigate("/announcements");
	};

	return (
		<div className="flex flex-col mx-2.5 p-2.5 rounded-lg bg-white shadow-custom-sm">
			<div className="flex justify-between items-center mb-2 border-b pb-2">
				<h3 className="font-bold text-lg text-gray-800">공지사항</h3>
				<button
					type="button"
					onClick={handleViewAllClick}
					className="flex items-center text-sm text-blue-600 font-medium"
				>
					더보기
					<ChevronRight className="w-4 h-4 ml-0.5" />
				</button>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-24">
					<Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
				</div>
			) : error ? (
				<div className="text-center py-3 text-gray-500">{error}</div>
			) : announcements.length === 0 ? (
				<div className="text-center py-3 text-gray-500">
					공지사항이 없습니다.
				</div>
			) : (
				<div className="flex flex-col">
					{announcements.map((announcement) => (
						<AnnouncementItem
							key={announcement.id}
							announcement={announcement}
							onClick={handleAnnouncementClick}
							compact={true}
							className="border-b border-gray-100"
						/>
					))}
				</div>
			)}
		</div>
	);
}

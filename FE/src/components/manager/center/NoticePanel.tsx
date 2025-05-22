import { useState } from "react";
import { IoMdAdd, IoIosSearch } from "react-icons/io";
import { BiSolidMegaphone } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import useCenterStore from "@/lib/store/centerStore";

// 공지사항 타입 정의
interface Notice {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	isImportant: boolean;
}

// 더미 공지사항 데이터
const dummyNotices: Notice[] = [
	{
		id: "1",
		title: "센터 임시 휴관 안내",
		content:
			"2023년 5월 5일(금)은 어린이날로 센터가 휴관합니다. 방문 예약은 전날까지 가능하며, 문의사항은 이메일로 부탁드립니다.",
		createdAt: new Date("2023-05-01"),
		isImportant: true,
	},
	{
		id: "2",
		title: "5월 입양 교육 일정",
		content:
			"5월 입양 전 교육은 매주 토요일 오후 2시에 진행됩니다. 참여를 원하시는 분들은 미리 예약해주세요.",
		createdAt: new Date("2023-04-25"),
		isImportant: false,
	},
	{
		id: "3",
		title: "새로운 강아지 입소 안내",
		content:
			"지난 주 새로운 아이들이 3마리 입소했습니다. 홈페이지에서 아이들의 정보를 확인하실 수 있습니다.",
		createdAt: new Date("2023-04-20"),
		isImportant: false,
	},
	{
		id: "4",
		title: "자원봉사자 모집",
		content:
			"주말 자원봉사자를 모집합니다. 관심 있으신 분들은 센터로 연락주세요.",
		createdAt: new Date("2023-04-15"),
		isImportant: false,
	},
	{
		id: "5",
		title: "후원물품 기부 안내",
		content:
			"현재 사료와 배변패드가 부족한 상황입니다. 후원 가능하신 분들의 많은 관심 부탁드립니다.",
		createdAt: new Date("2023-04-10"),
		isImportant: true,
	},
];

export default function NoticePanel() {
	const { selectedCenter } = useCenterStore();
	const [notices, setNotices] = useState<Notice[]>(dummyNotices);
	const [searchText, setSearchText] = useState("");
	const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(
		null,
	);
	const [showNewNoticeForm, setShowNewNoticeForm] = useState(false);
	const [newNotice, setNewNotice] = useState<
		Omit<Notice, "id" | "createdAt">
	>({
		title: "",
		content: "",
		isImportant: false,
	});

	// 공지사항 검색 기능
	const filteredNotices = notices.filter(
		(notice) =>
			notice.title.toLowerCase().includes(searchText.toLowerCase()) ||
			notice.content.toLowerCase().includes(searchText.toLowerCase()),
	);

	// 공지사항 상세 보기
	const toggleExpandNotice = (id: string) => {
		if (expandedNoticeId === id) {
			setExpandedNoticeId(null);
		} else {
			setExpandedNoticeId(id);
		}
	};

	// 새 공지사항 추가
	const handleAddNotice = () => {
		if (!newNotice.title.trim() || !newNotice.content.trim()) return;

		const id = `notice-${Date.now()}`;
		const createdAt = new Date();

		setNotices((prev) => [{ id, createdAt, ...newNotice }, ...prev]);

		setNewNotice({
			title: "",
			content: "",
			isImportant: false,
		});

		setShowNewNoticeForm(false);
	};

	// 공지사항 삭제
	const handleDeleteNotice = (id: string) => {
		setNotices((prev) => prev.filter((notice) => notice.id !== id));
		if (expandedNoticeId === id) {
			setExpandedNoticeId(null);
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h2 className="text-lg font-bold text-gray-800">
						{selectedCenter?.centerName || "센터"} 공지사항
					</h2>
					<p className="text-sm text-gray-500">
						중요한 소식을 전달해보세요
					</p>
				</div>
				<button
					type="button"
					className="bg-main text-white p-2 rounded-full shadow-sm flex items-center justify-center"
					onClick={() => setShowNewNoticeForm(!showNewNoticeForm)}
					aria-label="새 공지사항 작성"
				>
					<IoMdAdd size={20} />
				</button>
			</div>

			{/* 검색 필드 */}
			<div className="relative mb-4">
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<IoIosSearch className="text-gray-400" size={18} />
				</div>
				<input
					type="text"
					className="bg-white w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-100 text-sm focus:outline-none focus:border-main"
					placeholder="공지사항 검색..."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>

			{/* 새 공지사항 작성 폼 */}
			{showNewNoticeForm && (
				<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 animate-slideDown">
					<h3 className="font-bold text-gray-700 mb-3">
						새 공지사항
					</h3>
					<div className="space-y-3">
						<div>
							<input
								type="text"
								className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main"
								placeholder="제목"
								value={newNotice.title}
								onChange={(e) =>
									setNewNotice((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
							/>
						</div>
						<div>
							<textarea
								className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-main min-h-[100px]"
								placeholder="내용"
								value={newNotice.content}
								onChange={(e) =>
									setNewNotice((prev) => ({
										...prev,
										content: e.target.value,
									}))
								}
							/>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="isImportant"
								className="mr-2"
								checked={newNotice.isImportant}
								onChange={(e) =>
									setNewNotice((prev) => ({
										...prev,
										isImportant: e.target.checked,
									}))
								}
							/>
							<label
								htmlFor="isImportant"
								className="text-sm text-gray-700"
							>
								중요 공지로 표시
							</label>
						</div>
						<div className="flex justify-end space-x-2">
							<button
								type="button"
								className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg"
								onClick={() => setShowNewNoticeForm(false)}
							>
								취소
							</button>
							<button
								type="button"
								className="px-4 py-2 text-sm bg-main text-white rounded-lg"
								onClick={handleAddNotice}
							>
								등록하기
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 공지사항 목록 */}
			<div className="space-y-3">
				{filteredNotices.length === 0 ? (
					<p className="text-center py-4 text-gray-400 bg-white rounded-lg shadow-sm">
						{searchText
							? "검색 결과가 없습니다."
							: "공지사항이 없습니다."}
					</p>
				) : (
					filteredNotices.map((notice) => (
						<div
							key={notice.id}
							className={`bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer ${
								notice.isImportant
									? "border-red-200"
									: "border-gray-100"
							}`}
						>
							<div
								className={`p-4 w-full text-left ${expandedNoticeId === notice.id ? "border-b border-gray-100" : ""}`}
								onClick={() => toggleExpandNotice(notice.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggleExpandNotice(notice.id);
									}
								}}
							>
								<div className="flex justify-between items-start">
									<div className="flex items-start space-x-2">
										{notice.isImportant && (
											<span className="inline-block p-1.5 bg-red-50 rounded-full text-red-500">
												<BiSolidMegaphone size={14} />
											</span>
										)}
										<div>
											<h3
												className={`font-medium ${notice.isImportant ? "text-red-600" : "text-gray-800"}`}
											>
												{notice.title}
											</h3>
											<p className="text-xs text-gray-500 mt-1">
												{format(
													new Date(notice.createdAt),
													"yyyy년 MM월 dd일",
													{ locale: ko },
												)}
											</p>
										</div>
									</div>
									<div className="flex space-x-1">
										<button
											type="button"
											className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-full"
											aria-label="수정"
										>
											<FaRegEdit size={16} />
										</button>
										<button
											type="button"
											className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-200 bg-gray-100 rounded-full"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteNotice(notice.id);
											}}
											aria-label="삭제"
										>
											<RiDeleteBin6Line size={16} />
										</button>
									</div>
								</div>
							</div>

							{expandedNoticeId === notice.id && (
								<div className="p-4 bg-gray-50 animate-fadeIn">
									<p className="text-sm text-gray-700 whitespace-pre-line">
										{notice.content}
									</p>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}

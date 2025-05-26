import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Image as ImageIcon, Search } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	fetchAnnouncementDetailAPI,
	updateAnnouncementAPI,
} from "@/api/announcement";
import {
	updatePostAPI,
	fetchPostDetailAPI,
	fetchPostTypeDetailAPI,
} from "@/api/post";
import type { DogSearchResponse, DogSearchRequest } from "@/api/dog";
import { toast } from "sonner";
import { uploadImageAPI } from "@/api/common";
import { useDebounce } from "@/hooks/useDebounce";
import localAxios, { type PageInfo } from "@/api/http-commons";

export default function PostEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { selectedCenter } = useCenterStore();
	const [searchParams] = useSearchParams();

	const typeParam = searchParams.get("type");
	const isAnnouncement = typeParam === "announcements";
	const postTypeId =
		!isAnnouncement && typeParam ? Number.parseInt(typeParam, 10) : null;

	// 상태 관리
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [dogId, setDogId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	// 강아지 검색 관련 상태
	const [dogSearchTerm, setDogSearchTerm] = useState("");
	const [dogSearchResults, setDogSearchResults] = useState<
		DogSearchResponse[]
	>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [selectedDog, setSelectedDog] = useState<DogSearchResponse | null>(
		null,
	);
	const debouncedSearchTerm = useDebounce(dogSearchTerm, 300);
	const searchResultsRef = useRef<HTMLDivElement>(null);

	// ReactQuill 에디터 참조
	const quillRef = useRef<ReactQuill>(null);

	// 게시물 정보 불러오기
	useEffect(() => {
		const fetchPostData = async () => {
			if (!id) return;

			try {
				setInitialLoading(true);
				if (isAnnouncement && selectedCenter?.centerId) {
					// 공지사항 데이터 불러오기
					const data = await fetchAnnouncementDetailAPI(
						Number(id),
						Number(selectedCenter.centerId),
					);
					setTitle(data.title);
					setContent(data.content);
				} else {
					// 일반 게시글 데이터 불러오기
					const data = await fetchPostDetailAPI(Number(id));
					setTitle(data.title);
					setContent(data.content);
					setDogId(data.dogId || null);

					// 선택된 강아지가 있는 경우 정보 가져오기
					if (data.dogId && selectedCenter?.centerId) {
						try {
							// 강아지 정보를 직접 받아오기
							const searchParams = {
								centerId: String(selectedCenter.centerId),
								// 다른 필터링은 제외하고 ID로만 검색하도록 함
							};

							// Use localAxios directly like fetchDogsAPI does internally
							const response = await localAxios.get(
								"/dogs/search",
								{
									params: searchParams,
								},
							);

							const pageInfo =
								response.data as PageInfo<DogSearchResponse>;
							const dogs = pageInfo.data;

							// Find the dog with the matching ID
							const foundDog = dogs.find(
								(dog) => dog.dogId === data.dogId,
							);
							if (foundDog) {
								setSelectedDog(foundDog);
							}
						} catch (error) {
							console.error("강아지 정보 가져오기 실패:", error);
						}
					}
				}
			} catch (error) {
				console.error("게시글 데이터 불러오기 실패:", error);
				toast.error("게시글 정보를 불러오는데 실패했습니다.");
			} finally {
				setInitialLoading(false);
			}
		};

		fetchPostData();
	}, [id, selectedCenter?.centerId, isAnnouncement]);

	// 게시판 타입 정보 불러오기 (일반 게시글인 경우)
	const { data: postType } = useQuery({
		queryKey: ["postType", postTypeId],
		queryFn: () => {
			if (!postTypeId) return null;
			return fetchPostTypeDetailAPI(postTypeId);
		},
		enabled: !!postTypeId && !isAnnouncement,
	});

	// 공지사항 수정 API 뮤테이션
	const { mutate: updateAnnouncement } = useMutation({
		mutationFn: () =>
			updateAnnouncementAPI(
				Number(id),
				{ title, content },
				[], // 이미지는 에디터에 이미 S3 URL로 삽입되었으므로 빈 배열 전달
			),
		onSuccess: () => {
			toast.success("공지사항이 성공적으로 수정되었습니다.");
			// Set flag in sessionStorage to trigger refresh
			sessionStorage.setItem("announcement_refresh_needed", "true");
			navigate(-1);
		},
		onError: (error) => {
			console.error("공지사항 수정 실패:", error);
			toast.error("공지사항 수정에 실패했습니다. 다시 시도해주세요.");
		},
	});

	// 일반 게시글 수정 API 뮤테이션
	const { mutate: updatePost } = useMutation({
		mutationFn: () => {
			if (!postTypeId) {
				throw new Error("게시판 타입이 선택되지 않았습니다.");
			}
			return updatePostAPI(
				Number(id),
				{
					dogId: dogId || -1, // dogId는 optional, 없으면 -1으로
					title,
					content,
				},
				[], // 이미지는 에디터에 이미 S3 URL로 삽입되었으므로 빈 배열 전달
			);
		},
		onSuccess: () => {
			toast.success("게시글이 성공적으로 수정되었습니다.");
			navigate(-1);
		},
		onError: (error) => {
			console.error("게시글 수정 실패:", error);
			toast.error("게시글 수정에 실패했습니다. 다시 시도해주세요.");
		},
	});

	// 파일 업로드 및 에디터에 이미지 삽입
	const handleImageUpload = useCallback(async (file: File) => {
		// 파일 크기 검증 (10MB 제한)
		if (file.size > 10 * 1024 * 1024) {
			toast.error("파일 크기는 10MB 이하여야 합니다.");
			return;
		}

		// 이미지 타입 검증
		if (!file.type.startsWith("image/")) {
			toast.error("이미지 파일만 업로드할 수 있습니다.");
			return;
		}

		try {
			setImageUploading(true);

			// 이미지 업로드 API 호출 - S3에 업로드
			const s3ImageUrl = await uploadImageAPI(file);

			// 에디터 선택 정보 가져오기
			const editor = quillRef.current?.getEditor();
			const range = editor?.getSelection(true);

			// 에디터에 포커스 주기
			editor?.focus();

			// 에디터에 S3 이미지 URL 삽입
			if (range && editor) {
				// 이미지 삽입
				editor.insertEmbed(range.index, "image", s3ImageUrl);

				// 이미지 후에 커서 이동
				editor.setSelection(range.index + 1, 0);
			} else if (editor) {
				console.error("에디터 선택 범위를 가져올 수 없습니다");
				// 위치를 명시적으로 지정해서 시도
				editor.insertEmbed(0, "image", s3ImageUrl);
			}

			toast.success("이미지가 업로드되었습니다.");
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "이미지 업로드 중 오류가 발생했습니다.";
			toast.error(errorMessage);
			console.error("이미지 업로드 에러:", error);
		} finally {
			setImageUploading(false);
		}
	}, []);

	// 이미지 핸들러 생성
	const createImageHandler = useCallback(() => {
		return () => {
			const input = document.createElement("input");
			input.setAttribute("type", "file");
			input.setAttribute("accept", "image/*");
			input.click();

			input.onchange = async () => {
				if (!input.files?.length) return;
				await handleImageUpload(input.files[0]);
			};
		};
	}, [handleImageUpload]);

	// 에디터 모듈 설정
	const editorModules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					["bold", "italic", "underline", "strike"],
					[{ color: [] }, { background: [] }],
					[{ list: "ordered" }, { list: "bullet" }],
					[{ align: [] }],
					["link", "image"],
					["clean"],
				],
				handlers: {
					image: createImageHandler(),
				},
			},
			clipboard: {
				// 기본 붙여넣기 동작 커스터마이징 (이미지 붙여넣기 제한)
				matchVisual: false,
			},
			// 드래그 앤 드롭 비활성화
			keyboard: {
				bindings: {
					// 이미지 붙여넣기 단축키 비활성화
					"image-paste": {
						key: "V",
						shortKey: true,
						handler: () => false, // 핸들러가 false를 반환하면 기본 동작 중지
					},
				},
			},
		}),
		[createImageHandler],
	);

	// 로딩 인디케이터 컴포넌트
	const LoadingIndicator = () => (
		<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
			<div className="flex flex-col items-center">
				<div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
				<p className="mt-2 text-sm">이미지 업로드 중...</p>
			</div>
		</div>
	);

	// 모바일 전용 안내 배너
	const MobileHelpBanner = () => (
		<div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2">
			<ImageIcon
				size={18}
				className="text-blue-500 flex-shrink-0 mt-0.5"
			/>
			<div>
				<p className="text-sm text-blue-700 font-medium">
					이미지 업로드 도움말
				</p>
				<p className="text-xs text-blue-600 mt-1">
					툴바의 이미지 버튼을 클릭하여 사진을 추가할 수 있습니다.{" "}
					<br />
					모바일에서는 화면을 가로로 돌리면 더 편하게 사용할 수
					있습니다.
					<br />
					<span className="text-red">
						(단, 이미지 파일 크기는 10MB 이하여야 합니다.)
					</span>
				</p>
			</div>
		</div>
	);

	// 폼 제출 핸들러
	const handleSubmit = async () => {
		if (!title.trim()) {
			toast.error("제목을 입력해주세요.");
			return;
		}

		if (!content.trim()) {
			toast.error("내용을 입력해주세요.");
			return;
		}

		try {
			setIsLoading(true);
			// 게시판 타입에 따라 다른 API 호출
			if (isAnnouncement) {
				updateAnnouncement();
			} else {
				updatePost();
			}
		} catch (error) {
			console.error("게시글 수정 실패:", error);
			toast.error("게시글 수정에 실패했습니다. 다시 시도해주세요.");
			setIsLoading(false);
		}
	};

	// 드래그 앤 드롭 방지
	useEffect(() => {
		const preventDragDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
		};

		// 이미지 붙여넣기 방지
		const preventPasteImage = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			let hasImage = false;

			if (items) {
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf("image") !== -1) {
						hasImage = true;
						break;
					}
				}
			}

			// 에디터에 포커스가 있고 이미지가 있는 경우에만 기본 동작 방지
			if (
				hasImage &&
				document.activeElement?.className.includes("ql-editor")
			) {
				e.preventDefault();
				toast.warning(
					"이미지는 툴바의 이미지 버튼을 통해서만 업로드할 수 있습니다.",
				);
			}
		};

		document.addEventListener("dragover", preventDragDrop);
		document.addEventListener("drop", preventDragDrop);
		document.addEventListener("paste", preventPasteImage as EventListener);

		return () => {
			document.removeEventListener("dragover", preventDragDrop);
			document.removeEventListener("drop", preventDragDrop);
			document.removeEventListener(
				"paste",
				preventPasteImage as EventListener,
			);
		};
	}, []);

	// 강아지 검색 기능
	useEffect(() => {
		const searchDogs = async () => {
			if (
				!debouncedSearchTerm ||
				debouncedSearchTerm.length < 1 ||
				!selectedCenter?.centerId
			)
				return;

			try {
				setIsSearching(true);
				// Directly call the API instead of using the React Query function
				const searchParams = {
					centerId: String(selectedCenter.centerId),
					name: debouncedSearchTerm,
				};

				// Use localAxios directly like fetchDogsAPI does internally
				const response = await localAxios.get("/dogs/search", {
					params: searchParams,
				});

				const pageInfo = response.data as PageInfo<DogSearchResponse>;
				setDogSearchResults(pageInfo.data);
				setShowResults(true);
			} catch (error) {
				console.error("강아지 검색 실패:", error);
				toast.error("강아지 검색에 실패했습니다.");
			} finally {
				setIsSearching(false);
			}
		};

		searchDogs();
	}, [debouncedSearchTerm, selectedCenter?.centerId]);

	// 검색 결과 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchResultsRef.current &&
				!searchResultsRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// 강아지 선택 핸들러
	const handleSelectDog = (dog: DogSearchResponse) => {
		setDogId(dog.dogId);
		setSelectedDog(dog);
		setShowResults(false);
		setDogSearchTerm("");
	};

	const getPageTitle = () => {
		if (isAnnouncement) {
			return "공지사항 수정";
		}
		if (postType) {
			return `${postType.name} 게시글 수정`;
		}
		return "게시글 수정";
	};

	if (initialLoading) {
		return (
			<div className="flex items-center justify-center h-screen bg-white">
				<div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
				<p className="ml-3">게시글 정보를 불러오는 중...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 max-w-4xl">
			<div className="text-2xl font-bold mb-6">{getPageTitle()}</div>

			<div className="relative mb-8">
				{/* 모바일 환경에서 이미지 업로드 도움말 */}
				<div className="md:hidden mb-4">
					<MobileHelpBanner />
				</div>

				{/* 제목 입력 필드 */}
				<div className="mb-4">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						제목
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						placeholder="제목을 입력하세요"
					/>
				</div>

				{/* 강아지 검색 필드 (게시글 용) */}
				{!isAnnouncement && (
					<div className="mb-6 relative">
						<label
							htmlFor="dogSearch"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							강아지 검색 (선택사항)
						</label>
						<div className="relative">
							<input
								type="text"
								id="dogSearch"
								value={dogSearchTerm}
								onChange={(e) =>
									setDogSearchTerm(e.target.value)
								}
								className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								placeholder="강아지 이름으로 검색"
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						</div>

						{selectedDog && (
							<div className="mt-2 p-2 flex items-center gap-2 bg-primary/10 rounded-md">
								<span className="text-sm font-medium">
									선택된 강아지:
								</span>
								<div className="flex items-center gap-2">
									{selectedDog.imageUrl && (
										<img
											src={selectedDog.imageUrl}
											alt={selectedDog.name}
											className="w-6 h-6 rounded-full object-cover"
										/>
									)}
									<span className="text-sm">
										{selectedDog.name}
									</span>
								</div>
								<button
									type="button"
									onClick={() => {
										setSelectedDog(null);
										setDogId(null);
									}}
									className="ml-auto text-xs text-red-500 hover:text-red-700"
								>
									삭제
								</button>
							</div>
						)}

						{showResults && dogSearchResults.length > 0 && (
							<div
								ref={searchResultsRef}
								className="mt-2 w-full overflow-x-auto py-2"
							>
								<div className="flex space-x-2 min-w-max">
									{dogSearchResults.map((dog) => (
										<button
											key={dog.dogId}
											onClick={() => handleSelectDog(dog)}
											type="button"
											className="flex flex-col items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer w-24"
										>
											{dog.imageUrl ? (
												<img
													src={dog.imageUrl}
													alt={dog.name}
													className="w-16 h-16 rounded-full object-cover mb-1"
												/>
											) : (
												<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-1">
													<span className="text-gray-400">
														No img
													</span>
												</div>
											)}
											<div className="text-center">
												<div className="font-medium text-sm truncate w-full">
													{dog.name}
												</div>
												<div className="text-xs text-gray-500">
													ID: {dog.dogId}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						)}

						{showResults &&
							dogSearchResults.length === 0 &&
							!isSearching &&
							dogSearchTerm.length > 0 && (
								<div
									ref={searchResultsRef}
									className="mt-2 w-full p-4 bg-white rounded-md border border-gray-200 text-center text-gray-500"
								>
									검색 결과가 없습니다
								</div>
							)}

						{isSearching && (
							<div className="mt-2 w-full p-4 bg-white rounded-md border border-gray-200 text-center">
								<div className="w-5 h-5 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
							</div>
						)}
					</div>
				)}

				{/* 본문 에디터 */}
				<div className="relative min-h-[400px] mb-20">
					{imageUploading && <LoadingIndicator />}
					<ReactQuill
						ref={quillRef}
						theme="snow"
						value={content}
						onChange={setContent}
						modules={editorModules}
						placeholder="내용을 입력하세요..."
						className="h-[400px] editor-container" // 에디터 높이 설정
					/>
				</div>
			</div>

			{/* 하단 버튼 영역 */}
			<div className="flex justify-end space-x-3 mt-6">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
				>
					취소
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className={`px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark ${
						isLoading ? "opacity-70 cursor-not-allowed" : ""
					}`}
				>
					{isLoading ? "수정 중..." : "수정 완료"}
				</button>
			</div>
		</div>
	);
}

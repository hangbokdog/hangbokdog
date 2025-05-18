import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { createAnnouncementAPI } from "@/api/announcement";
import { toast } from "sonner";
import { uploadImageAPI } from "@/api/common";

export default function AnnouncementCreatePage() {
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();

	// 상태 관리
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);

	// ReactQuill 에디터 참조
	const quillRef = useRef<ReactQuill>(null);

	// 공지사항 생성 API 뮤테이션
	const { mutate: createAnnouncement } = useMutation({
		mutationFn: () =>
			createAnnouncementAPI(
				Number(selectedCenter?.centerId),
				{ title, content },
				[], // 이미지는 에디터에 이미 S3 URL로 삽입되었으므로 빈 배열 전달
			),
		onSuccess: () => {
			toast.success("공지사항이 성공적으로 등록되었습니다.");
			// Set flag in sessionStorage to trigger refresh
			sessionStorage.setItem("announcement_refresh_needed", "true");
			navigate(-1);
		},
		onError: (error) => {
			console.error("공지사항 등록 실패:", error);
			toast.error("공지사항 등록에 실패했습니다. 다시 시도해주세요.");
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
			console.log("이미지 업로드 시작:", file.name);

			// 이미지 업로드 API 호출 - S3에 업로드
			const s3ImageUrl = await uploadImageAPI(file);
			console.log("S3 업로드 성공. URL:", s3ImageUrl);

			// 에디터 선택 정보 가져오기
			const editor = quillRef.current?.getEditor();
			const range = editor?.getSelection(true);

			// 에디터에 포커스 주기
			editor?.focus();

			// 에디터에 S3 이미지 URL 삽입
			if (range && editor) {
				// 이미지 삽입
				console.log(`이미지 삽입 시도: 위치=${range.index}`);
				editor.insertEmbed(range.index, "image", s3ImageUrl);

				// 이미지 후에 커서 이동
				editor.setSelection(range.index + 1, 0);
				console.log("이미지 삽입 완료");
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
			createAnnouncement();
		} catch (error) {
			console.error("공지사항 등록 중 오류가 발생했습니다:", error);
			toast.error("서버 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsLoading(false);
		}
	};

	// 드래그 앤 드롭 방지를 위한 이벤트 핸들러 등록
	useEffect(() => {
		const preventDragDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		const preventPasteImage = (e: ClipboardEvent) => {
			// 텍스트 붙여넣기는 허용하고 이미지만 차단
			if (e.clipboardData) {
				for (let i = 0; i < e.clipboardData.items.length; i++) {
					const item = e.clipboardData.items[i];
					if (item.type.indexOf("image") !== -1) {
						e.preventDefault();
						toast.warning(
							"이미지는 툴바의 이미지 버튼을 통해서만 추가할 수 있습니다.",
						);
						return;
					}
				}
			}
		};

		// 에디터 컨테이너에 이벤트 리스너 등록
		if (quillRef.current) {
			try {
				const editor = quillRef.current.getEditor();
				if (editor?.root) {
					const editorRoot = editor.root;

					// 드래그 앤 드롭 이벤트 방지
					editorRoot.addEventListener(
						"dragover",
						preventDragDrop,
						true,
					);
					editorRoot.addEventListener("drop", preventDragDrop, true);
					editorRoot.addEventListener(
						"dragenter",
						preventDragDrop,
						true,
					);

					// 이미지 붙여넣기 방지
					editorRoot.addEventListener(
						"paste",
						preventPasteImage,
						true,
					);
				}
			} catch (error) {
				console.log("에디터가 아직 초기화되지 않았습니다.");
			}
		}

		return () => {
			if (quillRef.current) {
				try {
					const editor = quillRef.current.getEditor();
					if (editor?.root) {
						const editorRoot = editor.root;

						editorRoot.removeEventListener(
							"dragover",
							preventDragDrop,
							true,
						);
						editorRoot.removeEventListener(
							"drop",
							preventDragDrop,
							true,
						);
						editorRoot.removeEventListener(
							"dragenter",
							preventDragDrop,
							true,
						);
						editorRoot.removeEventListener(
							"paste",
							preventPasteImage,
							true,
						);
					}
				} catch (error) {
					// 무시
				}
			}
		};
	}, []);

	return (
		<div className="flex flex-col min-h-screen bg-white text-grayText font-medium">
			<div className="flex-1 p-4 flex flex-col gap-6 overflow-auto pb-24">
				<div className="text-xl font-bold">공지사항 작성</div>

				{/* 제목 */}
				<div className="flex flex-col gap-3">
					<label htmlFor="title" className="text-lg">
						제목 *
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="border border-gray-300 rounded p-2"
						placeholder="제목을 입력하세요."
						required
					/>
				</div>

				<MobileHelpBanner />

				{/* 내용 - 에디터 모듈 적용 */}
				<div className="flex flex-col gap-3">
					<label htmlFor="content" className="text-lg">
						내용 *
					</label>
					<div className="relative">
						{imageUploading && <LoadingIndicator />}
						<ReactQuill
							ref={quillRef}
							theme="snow"
							value={content}
							onChange={setContent}
							modules={editorModules}
							placeholder="내용을 입력하세요."
							className="min-h-[300px]"
						/>
					</div>
				</div>
			</div>

			<div className="sticky bottom-0 bg-white p-4 border-t">
				<div className="flex gap-3">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="w-full border border-gray-300 text-gray-700 rounded-full p-3 hover:bg-gray-100"
					>
						취소
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						className="w-full bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 disabled:bg-blue-300"
					>
						{isLoading ? "처리 중..." : "등록하기"}
					</button>
				</div>
			</div>
		</div>
	);
}

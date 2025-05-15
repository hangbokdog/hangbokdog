import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import useCenterStore from "@/lib/store/centerStore";
import { useMutation } from "@tanstack/react-query";
import { createAnnouncementAPI } from "@/api/announcement";
import { toast } from "sonner";

export default function AnnouncementCreatePage() {
	const navigate = useNavigate();
	const { selectedCenter } = useCenterStore();

	// 상태 관리
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [imageUploading, setImageUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);

	// ReactQuill 에디터 참조
	const quillRef = useRef<ReactQuill>(null);

	// 공지사항 생성 API 뮤테이션
	const { mutate: createAnnouncement } = useMutation({
		mutationFn: () =>
			createAnnouncementAPI(
				Number(selectedCenter?.centerId),
				{ title, content },
				uploadedFiles,
			),
		onSuccess: () => {
			toast.success("공지사항이 성공적으로 등록되었습니다.");
			navigate("/announcements");
		},
		onError: (error) => {
			console.error("공지사항 등록 실패:", error);
			toast.error("공지사항 등록에 실패했습니다. 다시 시도해주세요.");
		},
	});

	// 파일 추가 및 에디터에 이미지 임시 표시
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

			// 이미지를 로컬에서 미리보기 위한 URL 생성
			const tempUrl = URL.createObjectURL(file);

			// 에디터 선택 정보 가져오기
			const editor = quillRef.current?.getEditor();
			const range = editor?.getSelection(true);

			// 에디터에 포커스 주기
			editor?.focus();

			// 에디터에 임시 이미지 URL 삽입
			if (range && editor) {
				editor.insertEmbed(range.index, "image", tempUrl);
				editor.setSelection(range.index + 1, 0);
			} else if (editor) {
				editor.insertEmbed(0, "image", tempUrl);
			}

			// 업로드된 파일 목록에 추가
			setUploadedFiles((prev) => [...prev, file]);
			setImageUrls((prev) => [...prev, tempUrl]);

			toast.success("이미지가 추가되었습니다.");
		} catch (error) {
			toast.error("이미지 처리 중 오류가 발생했습니다.");
			console.error("이미지 처리 오류:", error);
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
		}),
		[createImageHandler],
	);

	// 로딩 인디케이터 컴포넌트
	const LoadingIndicator = () => (
		<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
			<div className="flex flex-col items-center">
				<div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
				<p className="mt-2 text-sm">이미지 처리 중...</p>
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

	// 컴포넌트 언마운트 시 임시 URL 해제
	useEffect(() => {
		return () => {
			for (const url of imageUrls) {
				URL.revokeObjectURL(url);
			}
		};
	}, [imageUrls]);

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

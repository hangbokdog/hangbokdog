import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	getVolunteerDetailAPI,
	patchVolunteerAPI,
	type VolunteerUpdateData,
} from "@/api/volunteer";
import { useQuery, useMutation } from "@tanstack/react-query";
import useCenterStore from "@/lib/store/centerStore";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AlertTriangle, Info, X, Image as ImageIcon } from "lucide-react";
import { uploadImageAPI } from "@/api/common";

// 에디터 타입 정의
type EditorType = "activityLog" | "info" | "precaution";

export default function VolunteerEditPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { selectedCenter } = useCenterStore();

	// 각 에디터별 Ref 생성
	const activityLogQuillRef = useRef<ReactQuill>(null);
	const infoQuillRef = useRef<ReactQuill>(null);
	const precautionQuillRef = useRef<ReactQuill>(null);

	// 상태 관리
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [activityLog, setActivityLog] = useState("");
	const [info, setInfo] = useState("");
	const [precaution, setPrecaution] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState<
		"activityLog" | "info" | "precaution"
	>("activityLog");

	// 각 에디터별 이미지 업로드 상태
	const [activityLogImageUploading, setActivityLogImageUploading] =
		useState(false);
	const [infoImageUploading, setInfoImageUploading] = useState(false);
	const [precautionImageUploading, setPrecautionImageUploading] =
		useState(false);

	// 봉사활동 상세 정보 조회
	const {
		data: volunteerDetail,
		isLoading: isDetailLoading,
		refetch,
	} = useQuery({
		queryKey: ["volunteerDetail", id],
		queryFn: () => getVolunteerDetailAPI({ eventId: id as string }),
		enabled: !!id,
	});

	// volunteerDetail 데이터가 변경될 때 상태 업데이트
	useEffect(() => {
		if (volunteerDetail) {
			setTitle(volunteerDetail.title || "");
			setContent(volunteerDetail.content || "");
			setActivityLog(volunteerDetail.activityLog || "");
			setInfo(volunteerDetail.info || "");
			setPrecaution(volunteerDetail.precaution || "");
		}
	}, [volunteerDetail]);

	// 봉사활동 수정 API 호출
	const { mutate: updateVolunteer } = useMutation({
		mutationFn: (updateData: VolunteerUpdateData) =>
			patchVolunteerAPI({
				eventId: id as string,
				centerId: selectedCenter?.centerId || "",
				updateData,
			}),
		onSuccess: () => {
			toast.success("봉사활동 정보가 수정되었습니다.");
			refetch();
			navigate(-1);
		},
		onError: () => {
			toast.error("봉사활동 정보 수정 중 오류가 발생했습니다.");
		},
	});

	// 에디터 타입에 따른 상태 설정 함수
	const getEditorState = useCallback(
		(type: EditorType) => {
			switch (type) {
				case "activityLog":
					return {
						ref: activityLogQuillRef,
						setUploading: setActivityLogImageUploading,
						isUploading: activityLogImageUploading,
					};
				case "info":
					return {
						ref: infoQuillRef,
						setUploading: setInfoImageUploading,
						isUploading: infoImageUploading,
					};
				case "precaution":
					return {
						ref: precautionQuillRef,
						setUploading: setPrecautionImageUploading,
						isUploading: precautionImageUploading,
					};
			}
		},
		[
			activityLogImageUploading,
			infoImageUploading,
			precautionImageUploading,
		],
	);

	// 파일 업로드 함수 - S3에 업로드하고 에디터에 이미지 삽입
	const uploadImageToS3AndInsert = useCallback(
		async (file: File, editorType: EditorType) => {
			const { ref, setUploading } = getEditorState(editorType);

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
				setUploading(true);

				// 이미지 업로드 API 호출
				const s3ImageUrl = await uploadImageAPI(file);

				// 에디터 선택 정보 가져오기
				const editor = ref.current?.getEditor();
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
				setUploading(false);
			}
		},
		[getEditorState],
	);

	// 각 에디터별 이미지 핸들러 생성
	const createImageHandler = useCallback(
		(editorType: EditorType) => {
			return () => {
				const input = document.createElement("input");
				input.setAttribute("type", "file");
				input.setAttribute("accept", "image/*");
				input.click();

				input.onchange = async () => {
					if (!input.files?.length) return;
					await uploadImageToS3AndInsert(input.files[0], editorType);
				};
			};
		},
		[uploadImageToS3AndInsert],
	);

	// 각 에디터별 모듈 설정 생성
	const createEditorModules = useCallback(
		(editorType: EditorType) => {
			return {
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
						image: createImageHandler(editorType),
					},
				},
			};
		},
		[createImageHandler],
	);

	// 폼 제출 핸들러
	const handleSubmit = async () => {
		if (!title) {
			toast.error("제목은 필수 입력사항입니다.");
			return;
		}

		try {
			setIsLoading(true);

			// 요청 데이터
			const updateData: VolunteerUpdateData = {
				title,
				content,
				activityLog,
				precaution,
				info,
			};

			updateVolunteer(updateData);
		} catch (error) {
			console.error("봉사활동 수정 중 오류가 발생했습니다:", error);
			toast.error("서버 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsLoading(false);
		}
	};

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

	if (isDetailLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				데이터를 불러오는 중...
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen bg-white text-grayText font-medium">
			<div className="flex-1 p-4 flex flex-col gap-6 overflow-auto pb-24">
				<div className="text-xl font-bold">봉사 일정 수정</div>

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

				{/* 내용 */}
				<div className="flex flex-col gap-3">
					<label htmlFor="content" className="text-lg">
						내용
					</label>
					<input
						type="text"
						id="content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="border border-gray-300 rounded p-2 bg-white"
						placeholder="내용을 입력하세요."
					/>
				</div>

				<MobileHelpBanner />

				{/* 에디터 탭 섹션 */}
				<div className="flex flex-col mt-4 bg-white border rounded-lg shadow-sm">
					<div className="editor-tabs flex">
						<button
							type="button"
							className={`flex-1 p-3 text-sm font-medium ${activeTab === "activityLog" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
							onClick={() => setActiveTab("activityLog")}
						>
							<span className="flex items-center justify-center">
								📝 활동 일지
							</span>
						</button>
						<button
							type="button"
							className={`flex-1 p-3 text-sm font-medium ${activeTab === "info" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
							onClick={() => setActiveTab("info")}
						>
							<span className="flex items-center justify-center">
								<Info size={16} className="mr-1" /> 봉사 안내
							</span>
						</button>
						<button
							type="button"
							className={`flex-1 p-3 text-sm font-medium ${activeTab === "precaution" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
							onClick={() => setActiveTab("precaution")}
						>
							<span className="flex items-center justify-center">
								<AlertTriangle
									size={16}
									className="mr-1 text-red-500"
								/>{" "}
								주의 사항
							</span>
						</button>
					</div>

					<div className="p-4">
						{/* 활동 일지 에디터 */}
						{activeTab === "activityLog" && (
							<div className="relative">
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-medium text-lg">
										활동 일지 작성
									</h3>
								</div>
								{activityLogImageUploading && (
									<LoadingIndicator />
								)}
								<div className="min-h-[300px]">
									<ReactQuill
										ref={activityLogQuillRef}
										theme="snow"
										value={activityLog}
										onChange={setActivityLog}
										modules={createEditorModules(
											"activityLog",
										)}
										placeholder="활동 일지를 작성하세요."
									/>
								</div>
							</div>
						)}

						{/* 봉사 안내 에디터 */}
						{activeTab === "info" && (
							<div className="relative">
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-medium text-lg flex items-center gap-2">
										<Info
											size={18}
											className="text-blue-500"
										/>
										봉사 안내
									</h3>
								</div>
								{infoImageUploading && <LoadingIndicator />}
								<div className="min-h-[300px]">
									<ReactQuill
										ref={infoQuillRef}
										theme="snow"
										value={info}
										onChange={setInfo}
										modules={createEditorModules("info")}
										placeholder="봉사 안내를 작성하세요."
									/>
								</div>
							</div>
						)}

						{/* 주의 사항 에디터 */}
						{activeTab === "precaution" && (
							<div className="relative">
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-medium text-lg flex items-center gap-2">
										<AlertTriangle
											size={18}
											className="text-red-500"
										/>
										주의 사항
									</h3>
								</div>
								{precautionImageUploading && (
									<LoadingIndicator />
								)}
								<div className="min-h-[300px]">
									<ReactQuill
										ref={precautionQuillRef}
										theme="snow"
										value={precaution}
										onChange={setPrecaution}
										modules={createEditorModules(
											"precaution",
										)}
										placeholder="주의 사항을 작성하세요."
									/>
								</div>
							</div>
						)}
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
						{isLoading ? "처리 중..." : "수정하기"}
					</button>
				</div>
			</div>
		</div>
	);
}

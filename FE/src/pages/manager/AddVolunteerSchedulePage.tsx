import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	Clock,
	AlertTriangle,
	Info,
	X,
	Image as ImageIcon,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import useCenterStore from "@/lib/store/centerStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getVolunteerInfoTemplateAPI,
	getVolunteerPrecautionTemplateAPI,
	addVolunteerWithCenterAPI,
	createVolunteerInfoTemplateAPI,
	createVolunteerPrecautionTemplateAPI,
	type VolunteerData,
} from "@/api/volunteer";
import { toast } from "sonner";
import { uploadImageAPI } from "@/api/common";

// 에디터 타입 정의
type EditorType =
	| "activityLog"
	| "info"
	| "precaution"
	| "infoTemplate"
	| "precautionTemplate";

interface SlotType {
	slotType: "MORNING" | "AFTERNOON";
	startTime: string; // "HH:MM:SS" 형식
	endTime: string; // "HH:MM:SS" 형식
	capacity: number;
}

export default function AddVolunteerSchedulePage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	// 각 에디터별 Ref 생성
	const activityLogQuillRef = useRef<ReactQuill>(null);
	const infoQuillRef = useRef<ReactQuill>(null);
	const precautionQuillRef = useRef<ReactQuill>(null);
	const infoTemplateQuillRef = useRef<ReactQuill>(null);
	const precautionTemplateQuillRef = useRef<ReactQuill>(null);

	// URL 파라미터에서 addressBookId 확인
	const addressBookId = searchParams.get("addressBookId");

	// 기본 상태 관리
	const [title, setTitle] = useState("");
	// const [content, setContent] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [useInfoTemplate, setUseInfoTemplate] = useState(false);
	const [usePrecautionTemplate, setUsePrecautionTemplate] = useState(false);
	const [info, setInfo] = useState("");
	const [precaution, setPrecaution] = useState("");
	const [activityLog, setActivityLog] = useState("");
	const [morningSlot, setMorningSlot] = useState<boolean>(true);
	const [afternoonSlot, setAfternoonSlot] = useState<boolean>(true);
	const [morningCapacity, setMorningCapacity] = useState<number>(6);
	const [afternoonCapacity, setAfternoonCapacity] = useState<number>(6);
	const [morningStartTime, setMorningStartTime] = useState("10:00");
	const [morningEndTime, setMorningEndTime] = useState("14:00");
	const [afternoonStartTime, setAfternoonStartTime] = useState("15:00");
	const [afternoonEndTime, setAfternoonEndTime] = useState("18:00");

	// 각 에디터별 이미지 업로드 상태
	const [activityLogImageUploading, setActivityLogImageUploading] =
		useState(false);
	const [infoImageUploading, setInfoImageUploading] = useState(false);
	const [precautionImageUploading, setPrecautionImageUploading] =
		useState(false);
	const [infoTemplateImageUploading, setInfoTemplateImageUploading] =
		useState(false);
	const [
		precautionTemplateImageUploading,
		setPrecautionTemplateImageUploading,
	] = useState(false);

	// 템플릿 없음 상태 관리
	const [infoTemplateNotFound, setInfoTemplateNotFound] = useState(false);
	const [precautionTemplateNotFound, setPrecautionTemplateNotFound] =
		useState(false);

	// 모달 상태 관리
	const [showInfoTemplateModal, setShowInfoTemplateModal] = useState(false);
	const [showPrecautionTemplateModal, setShowPrecautionTemplateModal] =
		useState(false);
	const [newInfoTemplate, setNewInfoTemplate] = useState("");
	const [newPrecautionTemplate, setNewPrecautionTemplate] = useState("");

	// 탭 관리를 위한 상태 추가
	const [activeTab, setActiveTab] = useState<
		"activityLog" | "info" | "precaution"
	>("activityLog");

	// 에디터 타입에 따른 상태 설정 함수
	const getEditorState = useMemo(
		() => (type: EditorType) => {
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
				case "infoTemplate":
					return {
						ref: infoTemplateQuillRef,
						setUploading: setInfoTemplateImageUploading,
						isUploading: infoTemplateImageUploading,
					};
				case "precautionTemplate":
					return {
						ref: precautionTemplateQuillRef,
						setUploading: setPrecautionTemplateImageUploading,
						isUploading: precautionTemplateImageUploading,
					};
			}
		},
		[
			activityLogImageUploading,
			infoImageUploading,
			precautionImageUploading,
			infoTemplateImageUploading,
			precautionTemplateImageUploading,
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

				// 이미지 업로드 API 호출 - S3에 업로드
				const s3ImageUrl = await uploadImageAPI(file);

				// 에디터 선택 정보 가져오기
				const editor = ref.current?.getEditor();
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
			};
		},
		[createImageHandler],
	);

	// 각 에디터별 모듈 메모이제이션
	const activityLogModules = useMemo(
		() => createEditorModules("activityLog"),
		[createEditorModules],
	);
	const infoModules = useMemo(
		() => createEditorModules("info"),
		[createEditorModules],
	);
	const precautionModules = useMemo(
		() => createEditorModules("precaution"),
		[createEditorModules],
	);
	const infoTemplateModules = useMemo(
		() => createEditorModules("infoTemplate"),
		[createEditorModules],
	);
	const precautionTemplateModules = useMemo(
		() => createEditorModules("precautionTemplate"),
		[createEditorModules],
	);

	// useEffect 추가: 에디터 스타일 설정
	useEffect(() => {
		// 스타일시트 생성
		const styleElement = document.createElement("style");
		styleElement.innerHTML = `
			.ql-editor.drag-over {
				background-color: rgba(0, 120, 255, 0.05);
				border: 2px dashed #0078ff;
			}
			
			/* 파일 드래그 중일 때 표시할 메시지 - 드래그 앤 드롭 비활성화로 사용하지 않음 */
			.ql-editor.drag-over::after {
				content: '드래그 앤 드롭은 지원하지 않습니다';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background-color: rgba(255, 255, 255, 0.9);
				padding: 8px 16px;
				border-radius: 4px;
				font-size: 14px;
				color: #ff0000;
				font-weight: 500;
				pointer-events: none;
			}
			
			/* 모바일 환경에서 툴바 개선 */
			@media (max-width: 640px) {
				.ql-toolbar.ql-snow {
					padding: 4px;
					overflow-x: auto;
					white-space: nowrap;
					-webkit-overflow-scrolling: touch;
					display: flex;
					flex-wrap: nowrap;
					justify-content: flex-start;
					gap: 2px;
				}
				
				.ql-toolbar.ql-snow .ql-formats {
					margin-right: 8px;
					display: inline-flex;
				}
				
				/* 이미지 버튼 강조 */
				.ql-toolbar .ql-image {
					position: relative;
					background-color: rgba(0, 120, 255, 0.1);
					border-radius: 4px;
				}
				
				.ql-toolbar .ql-image::after {
					content: '📷';
					position: absolute;
					bottom: -2px;
					right: -2px;
					font-size: 10px;
					pointer-events: none;
				}
			}
			
			/* 드래그 앤 드롭 비활성화를 위한 스타일 */
			.ql-container {
				position: relative;
			}
			
			.ql-container::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
				pointer-events: none;
			}
			
			/* 에디터 높이 증가 */
			.tall-editor .ql-editor {
				min-height: 300px;
				max-height: 500px;
				overflow-y: auto;
			}
			
			/* 에디터 탭 스타일 */
			.editor-tabs {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				border-bottom: 1px solid #e5e7eb;
			}
			
			.editor-tab {
				padding: 0.75rem 0.25rem;
				font-size: 0.875rem;
				font-weight: 500;
				color: #6b7280;
				cursor: pointer;
				transition: all 0.2s;
				border-bottom: 2px solid transparent;
			}
			
			.editor-tab.active {
				color: #3b82f6;
				border-bottom: 2px solid #3b82f6;
			}
			
			.editor-tab:hover:not(.active) {
				color: #4b5563;
				background-color: #f9fafb;
			}
			
			.editor-tab-icon {
				display: inline-flex;
				align-items: center;
				margin-right: 0.5rem;
			}
		`;
		document.head.appendChild(styleElement);

		// 클린업 함수
		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

	// useQuery를 사용하여 봉사 안내 템플릿 데이터 가져오기
	const {
		data: infoTemplateData,
		isLoading: isInfoTemplateLoading,
		refetch: refetchInfoTemplate,
	} = useQuery({
		queryKey: ["volunteerInfoTemplate", addressBookId],
		queryFn: () =>
			getVolunteerInfoTemplateAPI({
				addressBookId: addressBookId || "",
				centerId: selectedCenter?.centerId || "",
			}),
		enabled: false, // 초기에는 자동으로 실행하지 않음
	});

	// useQuery를 사용하여 봉사 주의사항 템플릿 데이터 가져오기
	const {
		data: precautionTemplateData,
		isLoading: isPrecautionTemplateLoading,
		refetch: refetchPrecautionTemplate,
	} = useQuery({
		queryKey: ["volunteerPrecautionTemplate", addressBookId],
		queryFn: () =>
			getVolunteerPrecautionTemplateAPI({
				addressBookId: addressBookId || "",
				centerId: selectedCenter?.centerId || "",
			}),
		enabled: false, // 초기에는 자동으로 실행하지 않음
	});

	// 템플릿 상태 확인 및 처리
	useEffect(() => {
		if (infoTemplateData) {
			if (
				infoTemplateData.info === "기본 템플릿이 없습니다" ||
				!infoTemplateData.info
			) {
				setInfoTemplateNotFound(true);
			} else {
				setInfoTemplateNotFound(false);
				if (useInfoTemplate) {
					setInfo(infoTemplateData.info || "");
				}
			}
		}
	}, [infoTemplateData, useInfoTemplate]);

	useEffect(() => {
		if (precautionTemplateData) {
			if (
				precautionTemplateData.precaution ===
					"기본 템플릿이 없습니다" ||
				!precautionTemplateData.precaution
			) {
				setPrecautionTemplateNotFound(true);
			} else {
				setPrecautionTemplateNotFound(false);
				if (usePrecautionTemplate) {
					setPrecaution(precautionTemplateData.precaution || "");
				}
			}
		}
	}, [precautionTemplateData, usePrecautionTemplate]);

	useEffect(() => {
		// addressBookId가 없으면 리다이렉트
		if (!addressBookId) {
			toast.error(
				"잘못된 접근입니다. 봉사 일정 관리 페이지로 이동합니다.",
			);
			navigate(-1);
			return;
		}
	}, [addressBookId, navigate]);

	// 정보 템플릿 생성 API 호출
	const { mutate: createInfoTemplate, isPending: isCreatingInfoTemplate } =
		useMutation({
			mutationFn: () =>
				createVolunteerInfoTemplateAPI({
					addressBookId: addressBookId || "",
					centerId: selectedCenter?.centerId || "",
					info: newInfoTemplate,
				}),
			onSuccess: () => {
				setShowInfoTemplateModal(false);
				toast.success("봉사 안내 템플릿이 생성되었습니다.");
				queryClient.invalidateQueries({
					queryKey: ["volunteerInfoTemplate", addressBookId],
				});
				refetchInfoTemplate();
				setInfoTemplateNotFound(false);
				setNewInfoTemplate("");
			},
			onError: () => {
				toast.error("템플릿 생성 중 오류가 발생했습니다.");
			},
		});

	// 주의사항 템플릿 생성 API 호출
	const {
		mutate: createPrecautionTemplate,
		isPending: isCreatingPrecautionTemplate,
	} = useMutation({
		mutationFn: () =>
			createVolunteerPrecautionTemplateAPI({
				addressBookId: addressBookId || "",
				centerId: selectedCenter?.centerId || "",
				precaution: newPrecautionTemplate,
			}),
		onSuccess: () => {
			setShowPrecautionTemplateModal(false);
			toast.success("봉사 주의사항 템플릿이 생성되었습니다.");
			queryClient.invalidateQueries({
				queryKey: ["volunteerPrecautionTemplate", addressBookId],
			});
			refetchPrecautionTemplate();
			setPrecautionTemplateNotFound(false);
			setNewPrecautionTemplate("");
		},
		onError: () => {
			toast.error("템플릿 생성 중 오류가 발생했습니다.");
		},
	});

	// 정보 템플릿을 가져왔을 때 상태 업데이트
	useEffect(() => {
		if (infoTemplateData && useInfoTemplate) {
			setInfo(infoTemplateData.info || "");
		}
	}, [infoTemplateData, useInfoTemplate]);

	// 주의사항 템플릿을 가져왔을 때 상태 업데이트
	useEffect(() => {
		if (precautionTemplateData && usePrecautionTemplate) {
			setPrecaution(precautionTemplateData.precaution || "");
		}
	}, [precautionTemplateData, usePrecautionTemplate]);

	// 정보 템플릿 토글 핸들러
	const handleInfoTemplateToggle = async (checked: boolean) => {
		setUseInfoTemplate(checked);

		if (checked) {
			// 체크박스가 활성화되면 템플릿을 가져옴
			refetchInfoTemplate();
		} else {
			// 체크박스가 비활성화되면 내용을 비움
			setInfo("");
		}
	};

	// 주의사항 템플릿 토글 핸들러
	const handlePrecautionTemplateToggle = async (checked: boolean) => {
		setUsePrecautionTemplate(checked);

		if (checked) {
			// 체크박스가 활성화되면 템플릿을 가져옴
			refetchPrecautionTemplate();
		} else {
			// 체크박스가 비활성화되면 내용을 비움
			setPrecaution("");
		}
	};

	// 타임슬롯 변환 함수 (기존 함수는 제거하고 새 함수로 대체)
	const formatTimeString = (timeString: string) => {
		return `${timeString}:00`;
	};

	// 정보 템플릿 생성 폼 제출 핸들러
	const handleInfoTemplateSubmit = () => {
		if (!newInfoTemplate.trim()) {
			toast.error("템플릿 내용을 입력해주세요.");
			return;
		}
		createInfoTemplate();
	};

	// 주의사항 템플릿 생성 폼 제출 핸들러
	const handlePrecautionTemplateSubmit = () => {
		if (!newPrecautionTemplate.trim()) {
			toast.error("템플릿 내용을 입력해주세요.");
			return;
		}
		createPrecautionTemplate();
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

		// 모든 에디터에 이벤트 핸들러 등록
		const editorRefs = [
			activityLogQuillRef,
			infoQuillRef,
			precautionQuillRef,
			infoTemplateQuillRef,
			precautionTemplateQuillRef,
		];

		// 각 에디터 컨테이너에 이벤트 리스너 등록
		for (const ref of editorRefs) {
			if (ref.current) {
				try {
					const editor = ref.current.getEditor();
					if (editor?.root) {
						const editorRoot = editor.root;

						// 드래그 앤 드롭 이벤트 방지
						editorRoot.addEventListener(
							"dragover",
							preventDragDrop,
							true,
						);
						editorRoot.addEventListener(
							"drop",
							preventDragDrop,
							true,
						);
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
		}

		// 클린업 함수
		return () => {
			for (const ref of editorRefs) {
				if (ref.current) {
					try {
						const editor = ref.current.getEditor();
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
			}
		};
	}, []);

	// 폼 제출 핸들러
	const handleSubmit = async () => {
		if (!title || !startDate || !endDate) {
			toast.error("제목, 시작일, 종료일은 필수 입력사항입니다.");
			return;
		}

		if (!morningSlot && !afternoonSlot) {
			toast.error("최소 하나 이상의 시간대를 선택해주세요.");
			return;
		}

		try {
			setIsLoading(true);

			// 슬롯 데이터 구성 (수정된 형식)
			const slots: SlotType[] = [];

			if (morningSlot) {
				slots.push({
					slotType: "MORNING",
					startTime: formatTimeString(morningStartTime),
					endTime: formatTimeString(morningEndTime),
					capacity: morningCapacity,
				});
			}

			if (afternoonSlot) {
				slots.push({
					slotType: "AFTERNOON",
					startTime: formatTimeString(afternoonStartTime),
					endTime: formatTimeString(afternoonEndTime),
					capacity: afternoonCapacity,
				});
			}

			// API 요청 데이터
			const data: VolunteerData = {
				title,
				// content,
				startDate,
				endDate,
				activityLog: activityLog || "",
				precaution: precaution || "",
				info: info || "",
				slots,
				addressBookId: Number(addressBookId),
			};

			// API 호출하여 봉사 일정 추가
			await addVolunteerWithCenterAPI({
				centerId: selectedCenter?.centerId,
				volunteerData: data,
			});

			toast.success("봉사 일정이 추가되었습니다.");
			navigate(-1);
		} catch (error) {
			console.error("봉사 일정 추가 중 오류가 발생했습니다:", error);
			toast.error("서버 오류가 발생했습니다. 다시 시도해주세요.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-white text-grayText font-medium">
			<div className="flex-1 p-4 flex flex-col gap-6 overflow-auto pb-24">
				<div className="text-xl font-bold">봉사 일정 생성</div>

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

				{/* 일시 */}
				<div className="flex flex-col gap-3">
					<label htmlFor="start-date" className="text-lg">
						기간 *
					</label>
					<div className="flex max-[375px]:flex-col flex-row gap-4 items-center max-[375px]:items-start">
						<input
							id="start-date"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="border p-2 rounded flex-1"
							required
						/>
						~
						<input
							id="end-date"
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="border p-2 rounded flex-1"
							required
						/>
					</div>
				</div>

				{/* 시간대 설정 */}
				<div className="flex flex-col gap-4">
					<label htmlFor="time-slots" className="text-lg">
						시간대 설정 *
					</label>

					{/* 오전 시간대 */}
					<div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Clock size={16} className="text-blue-500" />
								<span>오전 시간대</span>
							</div>
							<div
								className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
								onClick={() => setMorningSlot(!morningSlot)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setMorningSlot(!morningSlot);
									}
								}}
								tabIndex={0}
								role="switch"
								aria-checked={morningSlot}
							>
								<span
									className={`absolute ${morningSlot ? "translate-x-5 bg-male" : "bg-white translate-x-1"} inline-block h-5 w-5 transform rounded-full transition-transform`}
								/>
							</div>
						</div>

						{morningSlot && (
							<div className="pl-6 mt-2 space-y-3">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label htmlFor="morning-start">
											시작 시간
										</label>
										<input
											id="morning-start"
											type="time"
											value={morningStartTime}
											onChange={(e) =>
												setMorningStartTime(
													e.target.value,
												)
											}
											className="mt-1 border p-2 rounded w-full bg-white"
										/>
									</div>
									<div>
										<label htmlFor="morning-end">
											종료 시간
										</label>
										<input
											id="morning-end"
											type="time"
											value={morningEndTime}
											onChange={(e) =>
												setMorningEndTime(
													e.target.value,
												)
											}
											className="mt-1 border p-2 rounded w-full bg-white"
										/>
									</div>
								</div>
								<div>
									<label htmlFor="morning-capacity">
										최대 인원
									</label>
									<input
										id="morning-capacity"
										type="number"
										value={morningCapacity}
										onChange={(e) =>
											setMorningCapacity(
												Number(e.target.value),
											)
										}
										min="1"
										className="mt-1 border p-2 rounded w-full bg-white"
										placeholder="최대 인원수 입력"
									/>
								</div>
							</div>
						)}
					</div>

					{/* 오후 시간대 */}
					<div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Clock size={16} className="text-orange-500" />
								<span>오후 시간대</span>
							</div>
							<div
								className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
								onClick={() => setAfternoonSlot(!afternoonSlot)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setAfternoonSlot(!afternoonSlot);
									}
								}}
								tabIndex={0}
								role="switch"
								aria-checked={afternoonSlot}
							>
								<span
									className={`absolute ${afternoonSlot ? "translate-x-5 bg-male" : "bg-white translate-x-1"} inline-block h-5 w-5 transform rounded-full transition-transform`}
								/>
							</div>
						</div>

						{afternoonSlot && (
							<div className="pl-6 mt-2 space-y-3">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label htmlFor="afternoon-start">
											시작 시간
										</label>
										<input
											id="afternoon-start"
											type="time"
											value={afternoonStartTime}
											onChange={(e) =>
												setAfternoonStartTime(
													e.target.value,
												)
											}
											className="mt-1 border p-2 rounded w-full bg-white"
										/>
									</div>
									<div>
										<label htmlFor="afternoon-end">
											종료 시간
										</label>
										<input
											id="afternoon-end"
											type="time"
											value={afternoonEndTime}
											onChange={(e) =>
												setAfternoonEndTime(
													e.target.value,
												)
											}
											className="mt-1 border p-2 rounded w-full bg-white"
										/>
									</div>
								</div>
								<div>
									<label htmlFor="afternoon-capacity">
										최대 인원
									</label>
									<input
										id="afternoon-capacity"
										type="number"
										value={afternoonCapacity}
										onChange={(e) =>
											setAfternoonCapacity(
												Number(e.target.value),
											)
										}
										min="1"
										className="mt-1 border p-2 rounded w-full bg-white"
										placeholder="최대 인원수 입력"
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* 내용 */}
				{/* <div className="flex flex-col gap-3">
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
				</div> */}

				<MobileHelpBanner />

				{/* 에디터 탭 섹션 */}
				<div className="flex flex-col mt-4 bg-white border rounded-lg shadow-sm">
					<div className="editor-tabs">
						<button
							type="button"
							className={`editor-tab ${activeTab === "activityLog" ? "active" : ""}`}
							onClick={() => setActiveTab("activityLog")}
						>
							<span className="editor-tab-icon">📝</span>
							내용
						</button>
						<button
							type="button"
							className={`editor-tab ${activeTab === "info" ? "active" : ""}`}
							onClick={() => setActiveTab("info")}
						>
							<span className="editor-tab-icon">
								<Info size={16} className="text-blue-500" />
							</span>
							봉사 안내
							{useInfoTemplate && (
								<span className="ml-1 text-xs text-blue-500">
									<br />
									(템플릿)
								</span>
							)}
						</button>
						<button
							type="button"
							className={`editor-tab ${activeTab === "precaution" ? "active" : ""}`}
							onClick={() => setActiveTab("precaution")}
						>
							<span className="editor-tab-icon">
								<AlertTriangle
									size={16}
									className="text-red-500"
								/>
							</span>
							주의 사항
							{usePrecautionTemplate && (
								<span className="ml-1 text-xs text-red-500">
									<br />
									(템플릿)
								</span>
							)}
						</button>
					</div>

					<div className="p-4">
						{/* 내용 에디터 */}
						{activeTab === "activityLog" && (
							<div className="relative">
								<div className="flex items-center justify-between mb-3">
									<h3 className="font-medium text-lg">
										내용 작성
									</h3>
								</div>
								{activityLogImageUploading && (
									<LoadingIndicator />
								)}
								<div className="tall-editor">
									<ReactQuill
										ref={activityLogQuillRef}
										theme="snow"
										value={activityLog}
										onChange={setActivityLog}
										modules={activityLogModules}
										placeholder="내용을 작성하세요."
									/>
								</div>
							</div>
						)}

						{/* 봉사 안내 에디터 */}
						{activeTab === "info" && (
							<div className="relative">
								<div className="flex max-[375px]:flex-col flex-row items-center max-[375px]:items-start justify-between mb-3 gap-2">
									<h3 className="font-medium text-lg flex items-center gap-2">
										<Info
											size={18}
											className="text-blue-500"
										/>
										봉사 안내
									</h3>
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id="use-info-template"
											checked={useInfoTemplate}
											onChange={(e) =>
												handleInfoTemplateToggle(
													e.target.checked,
												)
											}
											disabled={
												isInfoTemplateLoading ||
												infoTemplateNotFound
											}
											className="rounded border-gray-300"
										/>
										<label
											htmlFor="use-info-template"
											className="text-sm"
										>
											{isInfoTemplateLoading
												? "불러오는 중..."
												: "기존 템플릿 사용"}
										</label>
										{infoTemplateNotFound && (
											<button
												type="button"
												onClick={() =>
													setShowInfoTemplateModal(
														true,
													)
												}
												className="text-sm text-blue-500 hover:underline"
											>
												기본 템플릿 생성
											</button>
										)}
									</div>
								</div>
								{infoImageUploading && <LoadingIndicator />}
								<div className="tall-editor">
									<ReactQuill
										ref={infoQuillRef}
										theme="snow"
										value={info}
										onChange={setInfo}
										modules={infoModules}
										placeholder="봉사 안내를 작성하세요."
									/>
								</div>
							</div>
						)}

						{/* 주의 사항 에디터 */}
						{activeTab === "precaution" && (
							<div className="relative">
								<div className="flex max-[375px]:flex-col flex-row items-center max-[375px]:items-start justify-between mb-3 gap-2">
									<h3 className="font-medium text-lg flex items-center gap-2">
										<AlertTriangle
											size={18}
											className="text-red-500"
										/>
										주의 사항
									</h3>
									<div className="flex items-center gap-2">
										<input
											type="checkbox"
											id="use-precaution-template"
											checked={usePrecautionTemplate}
											onChange={(e) =>
												handlePrecautionTemplateToggle(
													e.target.checked,
												)
											}
											disabled={
												isPrecautionTemplateLoading ||
												precautionTemplateNotFound
											}
											className="rounded border-gray-300"
										/>
										<label
											htmlFor="use-precaution-template"
											className="text-sm"
										>
											{isPrecautionTemplateLoading
												? "불러오는 중..."
												: "기존 템플릿 사용"}
										</label>
										{precautionTemplateNotFound && (
											<button
												type="button"
												onClick={() =>
													setShowPrecautionTemplateModal(
														true,
													)
												}
												className="text-sm text-blue-500 hover:underline"
											>
												기본 템플릿 생성
											</button>
										)}
									</div>
								</div>
								{precautionImageUploading && (
									<LoadingIndicator />
								)}
								<div className="tall-editor">
									<ReactQuill
										ref={precautionQuillRef}
										theme="snow"
										value={precaution}
										onChange={setPrecaution}
										modules={precautionModules}
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
						{isLoading ? "처리 중..." : "추가하기"}
					</button>
				</div>
			</div>

			{/* 정보 템플릿 생성 모달 - 에디터 모듈 적용 */}
			{showInfoTemplateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto my-auto">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-semibold">
								봉사 안내 템플릿 생성
							</h3>
							<button
								type="button"
								className="text-gray-500 hover:text-gray-700"
								onClick={() => setShowInfoTemplateModal(false)}
							>
								<X size={20} />
							</button>
						</div>
						<div className="mb-4">
							<label
								htmlFor="infoTemplate"
								className="block mb-2"
							>
								봉사 안내 템플릿 내용
							</label>
							<div className="relative">
								{infoTemplateImageUploading && (
									<LoadingIndicator />
								)}
								<div className="tall-editor">
									<ReactQuill
										ref={infoTemplateQuillRef}
										theme="snow"
										value={newInfoTemplate}
										onChange={setNewInfoTemplate}
										modules={infoTemplateModules}
									/>
								</div>
							</div>
						</div>
						<div className="flex justify-end gap-3 mt-12">
							<button
								type="button"
								onClick={() => setShowInfoTemplateModal(false)}
								className="px-4 py-2 border border-gray-300 rounded-lg"
							>
								취소
							</button>
							<button
								type="button"
								onClick={handleInfoTemplateSubmit}
								disabled={isCreatingInfoTemplate}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
							>
								{isCreatingInfoTemplate ? "생성 중..." : "생성"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 주의사항 템플릿 생성 모달 - 에디터 모듈 적용 */}
			{showPrecautionTemplateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto my-auto">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-semibold">
								봉사 주의사항 템플릿 생성
							</h3>
							<button
								type="button"
								className="text-gray-500 hover:text-gray-700"
								onClick={() =>
									setShowPrecautionTemplateModal(false)
								}
							>
								<X size={20} />
							</button>
						</div>
						<div className="mb-4">
							<label
								htmlFor="precautionTemplate"
								className="block mb-2"
							>
								봉사 주의사항 템플릿 내용
							</label>
							<div className="relative">
								{precautionTemplateImageUploading && (
									<LoadingIndicator />
								)}
								<div className="tall-editor">
									<ReactQuill
										ref={precautionTemplateQuillRef}
										theme="snow"
										value={newPrecautionTemplate}
										onChange={setNewPrecautionTemplate}
										modules={precautionTemplateModules}
									/>
								</div>
							</div>
						</div>
						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() =>
									setShowPrecautionTemplateModal(false)
								}
								className="px-4 py-2 border border-gray-300 rounded-lg"
							>
								취소
							</button>
							<button
								type="button"
								onClick={handlePrecautionTemplateSubmit}
								disabled={isCreatingPrecautionTemplate}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
							>
								{isCreatingPrecautionTemplate
									? "생성 중..."
									: "생성"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

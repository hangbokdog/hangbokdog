import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, AlertTriangle, Info, X } from "lucide-react";
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

interface SlotType {
	slotType: "MORNING" | "AFTERNOON";
	startTime: string; // "HH:MM:SS" 형식
	endTime: string; // "HH:MM:SS" 형식
	capacity: number;
}

interface TemplateResponse {
	info?: string;
	precaution?: string;
	status?: string;
}

export default function AddVolunteerSchedulePage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { selectedCenter } = useCenterStore();
	const queryClient = useQueryClient();

	// URL 파라미터에서 addressBookId 확인
	const addressBookId = searchParams.get("addressBookId");

	// 상태 관리
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
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
			navigate("/manager/volunteer");
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
				content,
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
			navigate("/manager/volunteer");
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
					<div className="flex gap-4 items-center">
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

				{/* 활동 일지 작성 예시 */}
				<div className="flex flex-col gap-3">
					<label
						htmlFor="activity-log"
						className="text-lg flex items-center"
					>
						활동 일지
					</label>
					<ReactQuill
						theme="snow"
						value={activityLog}
						onChange={setActivityLog}
					/>
				</div>

				{/* 봉사 안내 */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<label
							htmlFor="info"
							className="text-lg flex items-center gap-2"
						>
							<Info size={18} className="text-blue-500" />
							봉사 안내
						</label>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="use-info-template"
								checked={useInfoTemplate}
								onChange={(e) =>
									handleInfoTemplateToggle(e.target.checked)
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
										setShowInfoTemplateModal(true)
									}
									className="text-sm text-blue-500 hover:underline"
								>
									기본 템플릿 생성
								</button>
							)}
						</div>
					</div>
					<ReactQuill theme="snow" value={info} onChange={setInfo} />
				</div>

				{/* 주의 사항 */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<label
							htmlFor="precaution"
							className="text-lg flex items-center gap-2"
						>
							<AlertTriangle size={18} className="text-red-500" />
							주의 사항
						</label>
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
										setShowPrecautionTemplateModal(true)
									}
									className="text-sm text-blue-500 hover:underline"
								>
									기본 템플릿 생성
								</button>
							)}
						</div>
					</div>
					<ReactQuill
						theme="snow"
						value={precaution}
						onChange={setPrecaution}
					/>
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

			{/* 정보 템플릿 생성 모달 */}
			{showInfoTemplateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl">
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
							<ReactQuill
								theme="snow"
								value={newInfoTemplate}
								onChange={setNewInfoTemplate}
								className="h-64"
							/>
						</div>
						<div className="flex justify-end gap-3 mt-6">
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

			{/* 주의사항 템플릿 생성 모달 */}
			{showPrecautionTemplateModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl">
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
							<ReactQuill
								theme="snow"
								value={newPrecautionTemplate}
								onChange={setNewPrecautionTemplate}
								className="h-64"
							/>
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

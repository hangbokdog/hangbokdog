import { useState, useMemo, useEffect } from "react";
import VolunteerScheduleTable from "@/components/volunteer/VolunteerScheduleTable";
import SelectedSchedules from "@/components/volunteer/SelectedSchedules";
import type {
	Participant,
	ScheduleItem,
	SelectedSchedule,
	APIScheduleItem,
} from "@/types/volunteer";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getVolunteerScheduleApplyAPI,
	applyVolunteerAPI,
	type VolunteerApplicationRequest,
} from "@/api/volunteer";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import useAuthStore from "@/lib/store/authStore";
import { getNicknameSearchAPI } from "@/api/auth";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// 날짜를 M.DD(요일) 형식으로 변환하는 함수
const formatScheduleDate = (dateString: string): string => {
	const date = parseISO(dateString);
	return format(date, "M.dd(E)", { locale: ko });
};

export default function VolunteerApplyPage() {
	const { id } = useParams();
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// API에서 봉사 일정 데이터 가져오기
	const { data: apiScheduleData, isLoading } = useQuery({
		queryKey: ["volunteer", "schedule", "apply", id],
		queryFn: () => getVolunteerScheduleApplyAPI({ eventId: id as string }),
		enabled: !!id,
	});

	// API 데이터를 ScheduleItem 형식으로 변환
	const scheduleData: ScheduleItem[] = useMemo(() => {
		if (!apiScheduleData) return [];

		return apiScheduleData.map((item: APIScheduleItem) => ({
			date: formatScheduleDate(item.date),
			morning: `${item.morning.appliedCount}/${item.morning.capacity}`,
			afternoon: `${item.afternoon.appliedCount}/${item.afternoon.capacity}`,
			// 추가 정보 저장 (선택 로직에서 필요할 수 있음)
			morningSlotId: item.morning.volunteerSlotId,
			afternoonSlotId: item.afternoon.volunteerSlotId,
			rawDate: item.date,
		}));
	}, [apiScheduleData]);

	// Store primary user info separately to persist between schedule changes
	const [primaryUser, setPrimaryUser] = useState<Participant>({
		id: 0,
		nickname: "",
		name: "",
		phone: "",
	});

	// 선택된 일정 상태
	const [selectedSchedules, setSelectedSchedules] = useState<
		SelectedSchedule[]
	>([]);

	const handleScheduleSelect = (
		date: string,
		time: "morning" | "afternoon",
		capacity: string,
	) => {
		// Check if slot is full
		const [current, max] = capacity.split("/");
		if (Number.parseInt(current) >= Number.parseInt(max)) return;

		// Check if already selected
		const isSelected = selectedSchedules.some(
			(item) => item.date === date && item.time === time,
		);

		if (isSelected) {
			// 이미 선택된 경우 취소
			setSelectedSchedules(
				selectedSchedules.filter(
					(item) => !(item.date === date && item.time === time),
				),
			);
			return;
		}

		// 선택된 일정에 해당하는 원본 데이터 찾기
		const scheduleItem = scheduleData.find((item) => item.date === date);

		if (scheduleItem) {
			setSelectedSchedules([
				...selectedSchedules,
				{
					date,
					time,
					capacity,
					people: 1,
					participants: [{ ...primaryUser }],
					// 선택된 슬롯 ID 저장 (API 요청 시 필요)
					slotId:
						time === "morning"
							? scheduleItem.morningSlotId
							: scheduleItem.afternoonSlotId,
					rawDate: scheduleItem.rawDate,
				},
			]);
		}
	};

	const { data: myData } = useQuery({
		queryKey: ["nickname", "search", user.nickName],
		queryFn: () =>
			getNicknameSearchAPI({ nickname: user.nickName as string }),
		enabled: !!user.nickName,
	});

	const handleScheduleRemove = (
		date: string,
		time: "morning" | "afternoon",
	) => {
		setSelectedSchedules(
			selectedSchedules.filter(
				(item) => !(item.date === date && item.time === time),
			),
		);
	};

	const handlePeopleCountChange = (
		scheduleIndex: number,
		action: "increase" | "decrease",
	) => {
		const updatedSchedules = [...selectedSchedules];
		const schedule = updatedSchedules[scheduleIndex];

		if (action === "increase") {
			// Parse capacity string to get current and max values
			const [current, max] = schedule.capacity.split("/").map(Number);
			const remainingSlots = max - current;

			// Only allow increase if people count is less than remaining slots
			if (schedule.people < remainingSlots) {
				schedule.people += 1;
				schedule.participants.push({
					id: 0,
					nickname: "",
					name: "",
					phone: "",
				});
			}
		} else if (action === "decrease" && schedule.people > 1) {
			schedule.people -= 1;
			schedule.participants.pop();
		}

		setSelectedSchedules(updatedSchedules);
	};

	const handleNicknameSearch = async (
		scheduleIndex: number,
		participantIndex: number,
		nickname: string,
	) => {
		if (nickname.trim() !== "") {
			try {
				const participantData = await getNicknameSearchAPI({
					nickname,
				});

				if (participantData) {
					const updatedSchedules = [...selectedSchedules];
					updatedSchedules[scheduleIndex].participants[
						participantIndex
					] = {
						id: participantData.id || 0,
						nickname: participantData.nickName || "",
						name: participantData.name || "",
						phone: participantData.phone || "",
					};

					// 만약 이것이 주요 사용자면, primaryUser 상태도 업데이트
					if (participantIndex === 0) {
						const newPrimaryUser =
							updatedSchedules[scheduleIndex].participants[0];
						setPrimaryUser(newPrimaryUser);

						// 모든 일정에서 주요 사용자 업데이트
						for (const schedule of updatedSchedules) {
							schedule.participants[0] = { ...newPrimaryUser };
						}
					}

					setSelectedSchedules(updatedSchedules);
				}
			} catch (error) {
				toast.error("닉네임 검색에 실패했습니다.");
			}
		}
	};

	const handleParticipantChange = (
		scheduleIndex: number,
		participantIndex: number,
		field: keyof Participant,
		value: string,
	) => {
		const updatedSchedules = [...selectedSchedules];
		// Participant 타입의 필드에 접근할 수 있도록 타입 구체화
		const participant =
			updatedSchedules[scheduleIndex].participants[participantIndex];

		// field 타입이 keyof Participant이므로 타입 안전하게 접근
		if (field === "id") {
			participant.id = Number(value);
		} else if (
			field === "nickname" ||
			field === "name" ||
			field === "phone"
		) {
			participant[field] = value;
		}

		// If this is the primary user, update the primaryUser state
		if (participantIndex === 0) {
			const newPrimaryUser = { ...primaryUser, [field]: value };
			setPrimaryUser(newPrimaryUser);

			// Update primary user across all schedules
			for (const schedule of updatedSchedules) {
				schedule.participants[0] = { ...newPrimaryUser };
			}
		}

		setSelectedSchedules(updatedSchedules);
	};

	const isFormComplete = () => {
		if (selectedSchedules.length === 0) return false;
		// Check if all participants data is filled in all schedules
		return selectedSchedules.every((schedule) =>
			schedule.participants.every((participant) => participant.id !== 0),
		);
	};

	const isComplete = isFormComplete();

	useEffect(() => {
		if (user.nickName && myData) {
			setPrimaryUser({
				id: myData.id || 0,
				nickname: myData.nickName || "",
				name: myData.name || "",
				phone: myData.phone || "",
			});
		}
	}, [myData, user.nickName]);

	const applyMutation = useMutation({
		mutationFn: (applicationData: VolunteerApplicationRequest) =>
			applyVolunteerAPI({ eventId: id as string, applicationData }),
		onSuccess: () => {
			toast.success("봉사 신청이 완료되었습니다!");
			queryClient.invalidateQueries({
				queryKey: ["volunteer", "schedule", "apply", id],
			});
			queryClient.invalidateQueries({
				queryKey: ["volunteerDetail", id],
			});
			navigate(-1);
		},
		onError: (error: AxiosError) => {
			// API 응답 에러 정보 파싱
			let errorMessage = "봉사 신청에 실패했습니다.";

			try {
				// AxiosError에서 응답 데이터 추출
				const responseData = error.response?.data as
					| { code?: number; message?: string }
					| undefined;

				if (responseData) {
					const { code, message } = responseData;

					// 에러 코드에 따른 메시지 처리
					if (code === 15003) {
						if (message) {
							const match = message.match(
								/slotId: (\d+), memberId: (\d+)/,
							);
							if (match) {
								const [_, slotId, memberId] = match;
								errorMessage = `이미 동일한 날짜·슬롯에 신청했습니다. (슬롯ID: ${slotId})`;
							} else {
								errorMessage =
									"이미 동일한 날짜·슬롯에 신청했습니다.";
							}
						} else {
							errorMessage =
								"이미 동일한 날짜·슬롯에 신청했습니다.";
						}
					} else if (message) {
						errorMessage = message;
					}
				}
			} catch (parseError) {
				console.error("에러 메시지 파싱 실패:", parseError);
			}

			toast.error(errorMessage);
		},
	});

	const handleSubmit = () => {
		if (!isFormComplete()) return;

		// 신청 데이터 구성
		const applications = selectedSchedules
			.filter((schedule) => schedule.slotId !== undefined)
			.map((schedule) => ({
				date: schedule.rawDate || "",
				volunteerSlotId: schedule.slotId as number,
				participantIds: schedule.participants.map((p) => p.id),
			}));

		// API 호출
		applyMutation.mutate({ applications });
	};

	// 로딩 상태 처리
	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4" />
					<p className="text-grayText">
						일정 정보를 불러오는 중입니다...
					</p>
				</div>
			</div>
		);
	}

	// 데이터가 없는 경우 처리
	if (!apiScheduleData || apiScheduleData.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<p className="text-grayText text-center">
					일정 정보가 없거나 로드하는 중 오류가 발생했습니다.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col p-2.5 gap-4 mt-2.5">
			<span className="text-xl font-bold">일정 선택</span>
			<span className="text-sm text-primary">
				원하시는 날짜를 클릭해주세요!
			</span>

			<VolunteerScheduleTable
				scheduleData={scheduleData}
				selectedSchedules={selectedSchedules}
				onScheduleSelect={handleScheduleSelect}
			/>

			<SelectedSchedules
				selectedSchedules={selectedSchedules}
				onScheduleRemove={handleScheduleRemove}
				onPeopleCountChange={handlePeopleCountChange}
				onNicknameSearch={handleNicknameSearch}
				onParticipantChange={handleParticipantChange}
			/>

			<div className="flex justify-center">
				<button
					type="button"
					className={`${
						isComplete
							? "bg-main text-white"
							: "bg-superLightGray text-grayText cursor-not-allowed"
					} rounded-full py-3 px-4 font-medium transition-colors`}
					disabled={!isComplete || applyMutation.isPending}
					onClick={handleSubmit}
				>
					{applyMutation.isPending ? "신청중..." : "신청하기"}
				</button>
			</div>
		</div>
	);
}

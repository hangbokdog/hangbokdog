import type {
	ClosedVolunteerResponse,
	Volunteer,
	VolunteerApplicantsResponse,
	SlotApplicant,
	VolunteerApplicationStatus,
} from "@/types/volunteer";
import localAxios from "./http-commons";

export const getLatestVolunteerAPI = async ({
	centerId,
}: {
	centerId: string;
}): Promise<Volunteer[]> => {
	const response = await localAxios.get<Volunteer[]>(
		`volunteers/latest?centerId=${centerId}`,
	);
	return response.data;
};

export const getVolunteerScheduleAPI = async ({
	centerId,
}: {
	centerId: string;
}): Promise<Volunteer[]> => {
	const response = await localAxios.get<Volunteer[]>(
		`volunteers?centerId=${centerId}`,
	);
	return response.data;
};

export const getClosedVolunteerAPI = async ({
	centerId,
	pageToken,
}: {
	centerId: string;
	pageToken?: string | null;
}): Promise<ClosedVolunteerResponse> => {
	const response = await localAxios.get<ClosedVolunteerResponse>(
		`volunteers/ended?centerId=${centerId}${pageToken ? `&pageToken=${pageToken}` : ""}`,
	);
	return response.data;
};

export const getVolunteerDetailAPI = async ({
	eventId,
}: {
	eventId: string;
}) => {
	const response = await localAxios.get(`volunteers/${eventId}`);
	return response.data;
};

export const getVolunteerSlotsAPI = async ({
	eventId,
}: {
	eventId: string;
}) => {
	const response = await localAxios.get(
		`volunteers/${eventId}/volunteerSlots`,
	);
	return response.data;
};

// 센터의 봉사활동 일정 목록 조회
export const getVolunteersByAddressBookAPI = async ({
	addressBookId,
}: {
	addressBookId: string;
}): Promise<Volunteer[]> => {
	const response = await localAxios.get<Volunteer[]>(
		`volunteers/${addressBookId}/addressBooks`,
	);
	return response.data;
};

// 봉사활동 일정 추가
export const createVolunteerAPI = async (
	volunteerData: Omit<Volunteer, "id">,
) => {
	const response = await localAxios.post("volunteers", volunteerData);
	return response.data;
};

// 봉사 신청 수락
export const approveVolunteerApplicationAPI = async ({
	volunteerId,
	applicantId,
}: {
	volunteerId: number;
	applicantId: number;
}) => {
	const response = await localAxios.put(
		`volunteers/${volunteerId}/applicants/${applicantId}/approve`,
	);
	return response.data;
};

// 봉사 신청 거절
export const rejectVolunteerApplicationAPI = async ({
	volunteerId,
	applicantId,
}: {
	volunteerId: number;
	applicantId: number;
}) => {
	const response = await localAxios.put(
		`volunteers/${volunteerId}/applicants/${applicantId}/reject`,
	);
	return response.data;
};

// 봉사활동 안내 템플릿 조회
export const getVolunteerInfoTemplateAPI = async ({
	addressBookId,
	centerId,
}: {
	addressBookId: string | number;
	centerId: string | number;
}) => {
	const response = await localAxios.get(
		`volunteers/${addressBookId}/volunteerTemplates/info`,
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

// 봉사활동 주의사항 템플릿 조회
export const getVolunteerPrecautionTemplateAPI = async ({
	addressBookId,
	centerId,
}: {
	addressBookId: string | number;
	centerId: string | number;
}) => {
	const response = await localAxios.get(
		`volunteers/${addressBookId}/volunteerTemplates/precaution`,
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

// VolunteerData 타입 정의
export interface VolunteerData {
	title: string;
	content?: string;
	startDate: string;
	endDate: string;
	activityLog: string;
	precaution: string;
	info: string;
	slots: Array<{
		slotType: "MORNING" | "AFTERNOON";
		startTime: string; // "HH:MM:SS" 형식
		endTime: string; // "HH:MM:SS" 형식
		capacity: number;
	}>;
	addressBookId: number;
}

// 봉사활동 추가 (센터ID 포함)
export const addVolunteerWithCenterAPI = async ({
	centerId,
	volunteerData,
}: {
	centerId: string | number | undefined;
	volunteerData: VolunteerData;
}) => {
	if (!centerId) {
		throw new Error("센터 ID가 필요합니다");
	}
	const response = await localAxios.post(
		`volunteers?centerId=${centerId}`,
		volunteerData,
	);
	return response.data;
};

// 봉사활동 안내 템플릿 생성
export const createVolunteerInfoTemplateAPI = async ({
	addressBookId,
	centerId,
	info,
}: {
	addressBookId: string;
	centerId: string;
	info: string;
}) => {
	const response = await localAxios.post(
		`volunteers/${addressBookId}/volunteerTemplates/info`,
		{ info },
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

// 봉사활동 주의사항 템플릿 생성
export const createVolunteerPrecautionTemplateAPI = async ({
	addressBookId,
	centerId,
	precaution,
}: {
	addressBookId: string;
	centerId: string;
	precaution: string;
}) => {
	const response = await localAxios.post(
		`volunteers/${addressBookId}/volunteerTemplates/precaution`,
		{ precaution },
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

export const getVolunteerScheduleApplyAPI = async ({
	eventId,
}: {
	eventId: string;
}) => {
	const response = await localAxios.get(`/volunteers/${eventId}/schedule`);
	return response.data;
};

// 봉사 신청 API
export interface VolunteerApplication {
	date: string;
	volunteerSlotId: number;
	participantIds: number[];
}

export interface VolunteerApplicationRequest {
	applications: VolunteerApplication[];
}

export const applyVolunteerAPI = async ({
	eventId,
	applicationData,
}: {
	eventId: string | number;
	applicationData: VolunteerApplicationRequest;
}) => {
	const response = await localAxios.post(
		`/volunteers/${eventId}/applications`,
		applicationData,
	);
	return response.data;
};

// 봉사 신청자 목록 조회
export const getVolunteerApplicantsAPI = async ({
	centerId,
	eventId,
	status,
	pageToken,
}: {
	centerId: string;
	eventId: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
	pageToken?: string;
}): Promise<VolunteerApplicantsResponse> => {
	const response = await localAxios.get<VolunteerApplicantsResponse>(
		`/volunteers/${eventId}/applications`,
		{
			params: {
				centerId,
				status,
				pageToken,
			},
		},
	);
	return response.data;
};

// 봉사 신청 승인, 거절 api
export const updateVolunteerApplicantStatusAPI = async ({
	centerId,
	applicationId,
	status,
}: {
	centerId: string;
	applicationId: number;
	status: "APPROVED" | "REJECTED";
}) => {
	const response = await localAxios.patch(
		`/volunteers/applications/${applicationId}/status`,
		{ status },
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

// 슬롯별 신청자 목록 조회
export const getSlotApplicantsAPI = async ({
	slotId,
	centerId,
}: {
	slotId: number;
	centerId: string;
}): Promise<SlotApplicant[]> => {
	const response = await localAxios.get<SlotApplicant[]>(
		`volunteers/${slotId}/pendingApplications`,
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

export const deleteVolunteerAPI = async ({
	eventId,
	centerId,
}: {
	eventId: string | number;
	centerId: string | number;
}) => {
	const response = await localAxios.delete(`volunteers/${eventId}`, {
		params: {
			centerId,
		},
	});
	return response.data;
};

// 봉사활동 내용 수정 (PATCH)
export interface VolunteerUpdateData {
	title: string;
	content: string;
	activityLog: string;
	precaution: string;
	info: string;
}

export const patchVolunteerAPI = async ({
	eventId,
	centerId,
	updateData,
}: {
	eventId: string | number;
	centerId: string | number;
	updateData: VolunteerUpdateData;
}) => {
	const response = await localAxios.patch(
		`volunteers/${eventId}`,
		updateData,
		{
			params: {
				centerId,
			},
		},
	);
	return response.data;
};

export interface MemberApplicationInfo {
	volunteerEventId: number;
	date: string;
	title: string;
	status: VolunteerApplicationStatus;
}

export interface VolunteerApplicationResponse {
	memberApplicationInfo: MemberApplicationInfo[];
	count: number;
}

export const fetchAllMyVoluteersAPI = async (
	status: VolunteerApplicationStatus,
): Promise<VolunteerApplicationResponse> => {
	const response = await localAxios.get("/volunteers/myApplications", {
		params: {
			status,
		},
	});
	return response.data;
};

import type {
	CenterMember,
	CenterMemberThumb,
	CenterMembersResponse,
	CenterStatisticsResponse,
	CenterStatsResponse,
	Location,
} from "@/types/center";
import localAxios, { type PageInfo } from "./http-commons";

export interface centerCreateRequest {
	name: string;
	sponsorAmount: number;
	centerCity: Location;
}

export const createCenter = async (data: centerCreateRequest) => {
	const response = await localAxios.post("/centers", data);
	return response.data;
};

export const fetchCenters = async (
	name?: string | null,
	centerCity?: string | null,
) => {
	const response = await localAxios.get("/centers/search", {
		params: { name, centerCity },
	});
	return response.data;
};

export const fetchMyCenters = async () => {
	const response = await localAxios.get("/centers");
	return response.data;
};

export const fetchMyJoinRequestCenters = async () => {
	const response = await localAxios.get("/centerJoinRequests");
	return response.data;
};

export interface AddressBook {
	id: number;
	addressName: string;
	address: Location;
	appliedCount?: number;
}

export const fetchAddressBooks = async (
	centerId: string,
): Promise<AddressBook[]> => {
	const response = await localAxios.get(`/addressbooks/${centerId}`);
	return response.data;
};

export interface AddressBookRequest {
	addressName: string;
	address: string;
}

export const createAddressBookAPI = async (
	centerId: string,
	address: AddressBookRequest,
) => {
	const response = await localAxios.post("/addressbooks", address, {
		params: { centerId },
	});
	return response.data;
};

export const deleteAddressBookAPI = async (
	centerId: string,
	addressBookId: string,
) => {
	const response = await localAxios.delete(`/addressbooks/${addressBookId}`, {
		params: { centerId },
	});
	return response.data;
};

export const updateAddressBookAPI = async (
	centerId: string,
	addressBookId: string,
	request: AddressBookRequest,
) => {
	const response = await localAxios.patch(
		`/addressbooks/${addressBookId}`,
		request,
		{
			params: { centerId },
		},
	);
	return response.data;
};

export const registerCenterAPI = async (centerId: string) => {
	const response = await localAxios.post(`/centers/${centerId}/join-request`);
	return response.data;
};

export const cancelJoinRequestAPI = async (centerJoinRequestId: string) => {
	const response = await localAxios.delete(
		`/centerJoinRequests/${centerJoinRequestId}`,
	);
	return response.data;
};

export interface CenterJoinRequestResponse {
	centerJoinRequestId: string;
	name: string;
	profileImage: string;
}

export const fetchCenterJoinRequestAPI = async (
	centerId: string,
	pageToken?: string,
): Promise<PageInfo<CenterJoinRequestResponse>> => {
	const response = await localAxios.get(`/centerJoinRequests/${centerId}`, {
		params: { pageToken },
	});
	return response.data;
};

export const approveCenterJoinRequestAPI = async (
	centerJoinRequestId: string,
) => {
	const response = await localAxios.post(
		`/centerJoinRequests/${centerJoinRequestId}/approve`,
	);
	return response.data;
};

export const rejectCenterJoinRequestAPI = async (
	centerJoinRequestId: string,
) => {
	const response = await localAxios.patch(
		`/centerJoinRequests/${centerJoinRequestId}/reject`,
	);
	return response.data;
};

export const fetchExistingCenterCities = async () => {
	const response = await localAxios.get("/centers/existing-cities");
	return response.data;
};

export const fetchCenterStatsAPI = async (
	centerId: string,
): Promise<CenterStatsResponse> => {
	const response = await localAxios.get<CenterStatsResponse>(
		`/centers/${centerId}`,
	);
	return response.data;
};

export const addMainCenterIdAPI = async (centerId: string) => {
	const response = await localAxios.patch(`/centers/${centerId}/main`);
	return response.data;
};

export const fetchCenterMembersAPI = async (
	centerId: string,
	grade?: "MANAGER" | "USER",
	searchWord?: string,
	pageToken?: string | null,
): Promise<CenterMembersResponse> => {
	const params = {
		centerId,
		...(grade ? { grade } : {}),
		...(searchWord ? { searchWord } : {}),
		...(pageToken ? { pageToken } : {}),
	};
	const response = await localAxios.get<CenterMembersResponse>("/members", {
		params,
	});
	return response.data;
};

export const fetchCenterMemberAPI = async (
	centerId: string,
	memberId: number,
) => {
	const response = await localAxios.get<CenterMember>(
		`/members/${memberId}`,
		{
			params: { centerId },
		},
	);
	return response.data;
};

export const updateMemberGradeAPI = async (
	centerId: string,
	memberId: number,
	grade: "USER" | "MANAGER",
) => {
	const response = await localAxios.patch(
		`/centers/${centerId}/members/${memberId}`,
		{ grade },
	);
	return response.data;
};

export const deleteCenterMemberAPI = async (
	centerId: string,
	memberId: number,
) => {
	const response = await localAxios.delete(
		`/centers/${centerId}/members/${memberId}`,
	);
	return response.data;
};

export const fetchCenterStatisticsAPI = async (
	centerId: string,
): Promise<CenterStatisticsResponse> => {
	const response = await localAxios.get<CenterStatisticsResponse>(
		`/centers/${centerId}/statistics`,
	);
	return response.data;
};

export const kickOutCenterMemberAPI = async (
	centerId: string,
	memberId: string,
) => {
	const response = await localAxios.delete(`/centers/${memberId}/kickOut`, {
		params: { centerId },
	});
	return response.data;
};

export const promoteCenterMemberAPI = async (
	centerId: string,
	memberId: string,
) => {
	const response = await localAxios.post(
		`/centers/${memberId}/promote`,
		{},
		{
			params: { centerId },
		},
	);
	return response.data;
};

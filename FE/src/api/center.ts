import localAxios, { type PageInfo } from "./http-commons";

export interface centerCreateRequest {
	name: string;
	sponsorAmount: number;
}

export const createCenter = async (data: centerCreateRequest) => {
	const response = await localAxios.post("/centers", data);
	return response.data;
};

export const fetchCenters = async (name: string) => {
	const response = await localAxios.get("/centers/search", {
		params: { name },
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
	address: string;
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

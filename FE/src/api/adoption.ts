import localAxios from "./http-commons";

export interface AdoptionApplicationResponse {
	dogId: number;
	dogName: string;
	dogImage: string;
	count: number;
	createdAt: string;
}

export const fetchAdoptionApplicationsAPI = async (
	centerId: number,
): Promise<AdoptionApplicationResponse[]> => {
	const response = await localAxios.get("/adoptions", {
		params: {
			centerId,
		},
	});
	return response.data;
};

export interface AdoptionApplicationByDogResponse {
	memberId: number;
	name: string;
	profileImage: string;
	phoneNumber: string;
	createdAt: string;
}

export const fetchAdoptionApplicationsByDogAPI = async (
	dogId: number,
	centerId: number,
	name?: string,
): Promise<AdoptionApplicationByDogResponse[]> => {
	const response = await localAxios.get(`/adoptions/${dogId}/applications`, {
		params: {
			centerId,
			name,
		},
	});

	return response.data;
};

export interface AdoptionStatus {
	APPLIED: "APPLIED";
	UNDER_REVIEW: "UNDER_REVIEW";
	REJECTED: "REJECTED";
	ACCEPTED: "ACCEPTED";
}

export const manageAdoptionApplicationAPI = async (
	adoptionId: number,
	request: AdoptionStatus,
	centerId: number,
) => {
	const response = await localAxios.patch(`/adoptions/${adoptionId}`, {
		params: {
			request,
			centerId,
		},
	});
	return response.data;
};

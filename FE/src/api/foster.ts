import type { FosterStatus } from "@/types/foster";
import localAxios from "./http-commons";

export const applyFosterAPI = async (dogId: number, centerId: number) => {
	const response = await localAxios.post(`/dogs/${dogId}/fosters`, {
		centerId,
	});

	return response.data;
};

export const cancelFosterApplicationAPI = async (fosterId: number) => {
	const response = await localAxios.delete(`/fosters/${fosterId}`);
	return response.data;
};

export const decideFosterApplicationAPI = async (
	fosterId: number,
	request: FosterStatus,
	centerId: number,
) => {
	const response = await localAxios.patch(
		`/fosters/${fosterId}/application`,
		{
			params: {
				centerId,
				request,
			},
		},
	);
	return response.data;
};

export interface MyFosterResponse {
	dogId: number;
	dogName: string;
	profileImage: string;
	startDate: string;
	status: FosterStatus;
}

export const fetchMyFostersAPI = async (): Promise<MyFosterResponse[]> => {
	const response = await localAxios.get("/fosters/my");
	return response.data;
};

export const fetchFosterApplicationAPI = async (): Promise<
	MyFosterResponse[]
> => {
	const response = await localAxios.get("/fosters/applications");
	return response.data;
};

export interface FosterDiaryCheckResponse {
	memberId: number;
	name: string;
	profileImage: string;
	dogId: number;
	dogName: string;
	fosterId: number;
	postCount: number;
}

export const checkFosterDiariesAPI = async (
	centerId: number,
): Promise<FosterDiaryCheckResponse[]> => {
	const response = await localAxios.get("/fosters/check-diaries", {
		params: { centerId },
	});
	return response.data;
};

export interface DogFosterResponse {
	memberId: number;
	name: string;
	profileImage: string;
	startTime: string;
}

export const fetchFostersByDogIdAPI = async (
	dogId: number,
): Promise<DogFosterResponse> => {
	const response = await localAxios.get(`/dogs/fosters/${dogId}`);
	return response.data;
};

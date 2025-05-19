import type { DogBreed, DogStatus, Gender } from "@/types/dog";
import localAxios, { type PageInfo } from "./http-commons";
import type { AdoptionStatus } from "@/types/adoption";

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
	adoptionId: number;
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

export const manageAdoptionApplicationAPI = async (
	adoptionId: number,
	request: AdoptionStatus,
	centerId: number,
) => {
	const response = await localAxios.patch(`/adoptions/${adoptionId}`, null, {
		params: {
			request,
			centerId,
		},
	});
	return response.data;
};

export interface AdoptedDogDetailsResponse {
	dogId: number;
	dogStatus: DogStatus;
	centerId: number;
	centerName: string;
	dogName: string;
	profileImageUrl: string;
	color: string[];
	rescuedDate: string;
	weight: number;
	description: string;
	isStar: boolean;
	gender: Gender;
	isNeutered: boolean;
	breed: DogBreed;
	age: number;
	isLiked: boolean;
	favoriteCount: number;
	dogCommentCount: number;
	adoptedDate: string;
	adopterId: number;
	adopterName: string;
	adopterImage: string;
}

export const fetchAdoptedDogDetailsAPI = async (
	dogId: number,
): Promise<AdoptedDogDetailsResponse> => {
	const response = await localAxios.get(`/adoptions/${dogId}`);
	return response.data;
};

export const fetchAppliesCountOfDogs = async (centerId: number) => {
	const response = await localAxios.get("/adoptions/appliesCount", {
		params: {
			centerId,
		},
	});
	return response.data;
};

export const fetchAdoptedDogCount = async (centerId: number) => {
	const response = await localAxios.get("/adoptions/adoptedCount", {
		params: {
			centerId,
		},
	});
	return response.data;
};

export interface AdoptionSearchRequest {
	centerId: number;
	name?: string;
	breed?: DogBreed[];
	gender?: Gender;
	start?: string;
	end?: string;
	isNeutered?: boolean;
	isStar?: boolean;
	pageToken?: string;
}

export interface AdoptionSearchResponse {
	dogId: number;
	name: string;
	imageUrl: string;
	ageMonth: number;
	breed: DogBreed;
	gender: Gender;
	isNeutered: boolean;
	isStar: boolean;
	adoptedDate: string;
	isFavorite: boolean;
}

export const adoptionSearchAPI = async (
	params: AdoptionSearchRequest,
): Promise<PageInfo<AdoptionSearchResponse>> => {
	const response = await localAxios.get("/adoptions/search", {
		params,
	});
	return response.data;
};

export interface MyAdoptionResponse {
	dogId: number;
	dogName: string;
	profileImage: string;
	startDate: string;
	status: AdoptionStatus;
}
export const fetchMyAdoptionsAPI = async (
	centerId: number,
): Promise<MyAdoptionResponse[]> => {
	const response = await localAxios.get("/adoptions/my", {
		params: { centerId },
	});
	return response.data;
};

import type {
	DogBreed,
	DogCommentItem,
	DogLatestResponse,
	DogStatus,
	Gender,
	MedicalType,
} from "@/types/dog";
import localAxios from "./http-commons";

export const createDogAPI = async (data: FormData) => {
	const response = await localAxios.post("/dogs", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data.dogId;
};

export const getLatestDogAPI = async (
	centerId: string,
): Promise<DogLatestResponse> => {
	const response = await localAxios.get<DogLatestResponse>("/dogs/dogCount", {
		params: { centerId },
	});
	return response.data;
};

export interface DogDetailResponse {
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
	location: string;
	isLiked: boolean;
	favoriteCount: number;
	currentSponsorCount: number;
	dogCommentCount: number;
}

export const fetchDogDetail = async (dogId: number, centerId: string) => {
	const response = await localAxios.get(`/dogs/${dogId}`, {
		params: { centerId },
	});
	const data = response.data as DogDetailResponse;
	return data;
};

export interface DogSponsor {
	memberId: number;
	name: string;
	profileImage: string;
	startTime: string;
}

export const fetchDogSponsors = async (dogId: number) => {
	const response = await localAxios.get(`/dogs/fosters/${dogId}`);
	return response.data as DogSponsor[];
};

export interface MedicalHistoryResponse {
	id: number;
	content: string;
	medicalPeriod: number;
	medicalType: MedicalType;
	operatedDate: string;
	image: string;
}

export const fetchDogMedicalHistory = async (dogId: number) => {
	const response = await localAxios.get(`/dogs/${dogId}/medical-history`);
	return response.data as MedicalHistoryResponse[];
};

export const getDogCommentsAPI = async (
	dogId: number,
): Promise<DogCommentItem[]> => {
	const response = await localAxios.get<DogCommentItem[]>(
		`/${dogId}/comments`,
	);
	return response.data;
};

export const createDogCommentAPI = async (
	dogId: number,
	content: string,
	parentId: number | null,
) => {
	const response = await localAxios.post(`/${dogId}/comments`, {
		content,
		parentId,
	});
	return response.data;
};

export const addDogFavoriteAPI = async (dogId: number) => {
	const response = await localAxios.post(`/dogs/${dogId}/favorite`);
	return response.data;
};

export const removeDogFavoriteAPI = async (dogId: number) => {
	const response = await localAxios.delete(`/dogs/${dogId}/favorite`);
	return response.data;
};

export const toggleDogCommentLikeAPI = async (
	dogId: number,
	dogCommentId: number,
) => {
	const response = await localAxios.post(
		`/${dogId}/comments/${dogCommentId}`,
	);
	return response.data;
};

export const updateDogCommentAPI = async (
	dogId: number,
	dogCommentId: number,
	content: string,
) => {
	const response = await localAxios.patch(
		`/${dogId}/comments/${dogCommentId}`,
		{
			content,
		},
	);
	return response.data;
};

export const deleteDogCommentAPI = async (
	dogId: number,
	dogCommentId: number,
) => {
	const response = await localAxios.delete(
		`/${dogId}/comments/${dogCommentId}`,
	);
	return response.data;
};

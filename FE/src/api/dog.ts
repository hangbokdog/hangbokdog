import type {
	DogBreed,
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

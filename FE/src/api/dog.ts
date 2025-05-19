import type {
	DogBreed,
	DogLatestResponse,
	DogStatus,
	Gender,
	MedicalType,
} from "@/types/dog";
import localAxios, { type PageInfo } from "./http-commons";
import type { QueryFunction } from "@tanstack/react-query";
import type { commentData, CommentItemData } from "@/types/comment";

export const createDogAPI = async (data: FormData) => {
	const response = await localAxios.post("/dogs", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data.dogId;
};

export interface UpdateDogRequest {
	dogName: string;
	weight: number;
	description: string;
	isNeutered: boolean;
	locationId: number;
	dogBreed: DogBreed;
	isStar: boolean;
}

export const updateDogAPI = async (
	centerId: number,
	dogId: number,
	request: UpdateDogRequest,
	image: File | null,
) => {
	const formData = new FormData();

	const jsonBlob = new Blob([JSON.stringify(request)], {
		type: "application/json",
	});

	formData.append("request", jsonBlob);

	if (image) {
		formData.append("image", image);
	}

	const response = await localAxios.patch(`/dogs/${dogId}`, formData, {
		params: { centerId },
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
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
	locationId: number;
	isLiked: boolean;
	favoriteCount: number;
	currentSponsorCount: number;
	dogCommentCount: number;
	isFosterApply?: boolean;
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

export interface MedicalHistoryRequest {
	content: string;
	medicalPeriod: number;
	medicalType: MedicalType;
	operatedDate: string;
}

export const createDogMedicalHistoryAPI = async (
	dogId: number,
	centerId: number,
	request: MedicalHistoryRequest,
	image: File | null,
) => {
	const formData = new FormData();

	const jsonBlob = new Blob([JSON.stringify(request)], {
		type: "application/json",
	});

	formData.append("request", jsonBlob);

	if (image) {
		formData.append("image", image);
	}

	const response = await localAxios.post(
		`/dogs/${dogId}/medical-history`,
		formData,
		{
			params: { centerId },
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

export interface MedicalHistoryResponse {
	id: number;
	memberId: number;
	content: string;
	medicalPeriod: number;
	medicalType: MedicalType;
	operatedDate: string;
	image: string;
}

export const fetchDogMedicalHistory = async (
	dogId: number,
	pageToken?: string,
): Promise<PageInfo<MedicalHistoryResponse>> => {
	const response = await localAxios.get(`/dogs/${dogId}/medical-history`, {
		params: { pageToken },
	});
	return response.data;
};

export const removeDogMedicalHistoryAPI = async (
	medicalHistoryId: number,
	centerId: number,
	dogId: number,
) => {
	const response = await localAxios.delete(`/dogs/${dogId}/medical-history`, {
		params: { medicalHistoryId, centerId },
	});

	return response.data;
};

export interface UpdateMedicalHistoryRequest {
	content: string;
	medicalPeriod: number;
	medicalType: MedicalType;
	operatedDate: string;
}

export const updateMedicalHistoryAPI = async (
	medicalHistoryId: number,
	request: UpdateMedicalHistoryRequest,
	image: File | null,
	centerId: number,
) => {
	const formData = new FormData();
	const jsonBlob = new Blob([JSON.stringify(request)], {
		type: "application/json",
	});

	formData.append("request", jsonBlob);

	if (image) {
		formData.append("image", image);
	}

	const response = await localAxios.patch(
		`/dogs/medicalHistory/${medicalHistoryId}`,
		formData,
		{
			params: { centerId },
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

export interface DogCommentItem {
	dogComment: {
		id: number;
		commentId: number;
		parentId: number | null;
		author: {
			id: number;
			nickName: string;
			profileImage: string;
			grade: string;
		};
		content: string;
		createdAt: string;
		isDeleted: boolean;
		isAuthor: boolean;
		isLiked: boolean;
		likeCount: number;
	};
	replies: DogCommentItem[];
}

export const getDogCommentsAPI = async (
	dogId: number,
): Promise<CommentItemData[]> => {
	const response = await localAxios.get<DogCommentItem[]>(
		`/${dogId}/comments`,
	);

	// Transform DogCommentItem to CommentItemData
	const transformedData = response.data.map(dogCommentToCommentItem);
	return transformedData;
};

// Helper function to transform DogCommentItem to CommentItemData
const dogCommentToCommentItem = (
	dogCommentItem: DogCommentItem,
): CommentItemData => {
	return {
		comment: {
			id: dogCommentItem.dogComment.id,
			parentId: dogCommentItem.dogComment.parentId,
			author: {
				id: dogCommentItem.dogComment.author.id,
				nickName: dogCommentItem.dogComment.author.nickName,
				profileImage: dogCommentItem.dogComment.author.profileImage,
				grade: dogCommentItem.dogComment.author.grade,
			},
			content: dogCommentItem.dogComment.content,
			createdAt: dogCommentItem.dogComment.createdAt,
			isDeleted: dogCommentItem.dogComment.isDeleted,
			isAuthor: dogCommentItem.dogComment.isAuthor,
			isLiked: dogCommentItem.dogComment.isLiked,
			likeCount: dogCommentItem.dogComment.likeCount,
		},
		replies: dogCommentItem.replies.map(dogCommentToCommentItem),
	};
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

export interface DogSearchResponse {
	dogId: number;
	name: string;
	imageUrl: string;
	ageMonth: number;
	gender: Gender;
	isFavorite: boolean;
	favoriteCount: number;
	isStar: boolean;
}

export interface DogSearchRequest {
	centerId: string;
	name?: string;
	breed?: DogBreed[];
	gender?: Gender;
	start?: string;
	end?: string;
	isNeutered?: boolean;
	locationId?: string[];
	isStar?: boolean;
}

export const fetchDogsAPI: QueryFunction<
	PageInfo<DogSearchResponse>,
	[string, DogSearchRequest],
	string | null
> = async ({ pageParam = null, queryKey }) => {
	const [, params] = queryKey as [string, DogSearchRequest];

	const serializedParams = {
		...params,
		breed: params.breed?.join(","),
		locationId: params.locationId?.join(","),
		pageToken: pageParam,
	};

	const response = await localAxios.get<PageInfo<DogSearchResponse>>(
		"/dogs/search",
		{
			params: serializedParams,
		},
	);
	console.log("response", response.data);
	return response.data;
};

export const applySponsorAPI = async (dogId: string, centerId: string) => {
	const response = await localAxios.post(
		`/dogs/${dogId}/apply-sponsor`,
		null,
		{
			params: { centerId },
		},
	);
	return response.data;
};

export const applyAdoptionAPI = async (dogId: string) => {
	const response = await localAxios.post("/adoptions", null, {
		params: { dogId },
	});
	return response.data;
};

export const applyFosterAPI = async (dogId: string, centerId: string) => {
	const response = await localAxios.post(`/dogs/${dogId}/fosters`, null, {
		params: { centerId },
	});
	return response.data;
};

export interface HospitalDogResponse {
	dogId: number;
	name: string;
	imageUrl: string;
	ageMonth: number;
}

export const fetchHospitalDogsAPI = async (
	centerId: number,
	pageToken?: string,
): Promise<PageInfo<HospitalDogResponse[]>> => {
	const response = await localAxios.get("/dogs/hospital", {
		params: { centerId, pageToken },
	});
	return response.data;
};

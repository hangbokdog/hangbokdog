import localAxios, { type PageInfo } from "./http-commons";

export interface VaccinationCreateRequest {
	title: string;
	content: string;
	operatedDate: string;
	locationIds: number[];
}

export type VaccinationCreateResponse = {
	vaccinationId: number;
};

export const createVaccinationAPI = async (
	request: VaccinationCreateRequest,
	centerId: number,
) => {
	const response = await localAxios.post("vaccinations", request, {
		params: { centerId },
	});

	return response.data;
};

export interface LocationInfo {
	locationId: number;
	locationName: string;
}

export interface VaccinationSummaryResponse {
	vaccinationId: number;
	title: string;
	content: string;
	operatedDate: string;
	locationInfos: LocationInfo[];
}

export const fetchVaccinationSummariesAPI = async (
	centerId: number,
	pageToken?: string,
): Promise<PageInfo<VaccinationSummaryResponse>> => {
	const response = await localAxios.get("vaccinations", {
		params: { centerId, pageToken },
	});
	return response.data;
};

export interface VaccinationStatus {
	ONGOING: "ONGOING";
	COMPLETED: "COMPLETED";
}

export interface VaccinationDetailResponse {
	vaccinationId: number;
	title: string;
	content: string;
	operatedDate: string;
	authorId: number;
	authorName: string;
	authorProfileImage: string;
	completedDogCount: number;
	totalCount: number;
	status: VaccinationStatus;
}

export const fetchVaccinationDetailAPI = async (vaccinationId: number) => {
	const response = await localAxios.get(`vaccinations/${vaccinationId}`);
	return response.data;
};

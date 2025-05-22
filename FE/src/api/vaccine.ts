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
	status: VaccinationStatus;
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
	locationNames: string[];
}

export const fetchVaccinationDetailAPI = async (vaccinationId: number) => {
	const response = await localAxios.get(`vaccinations/${vaccinationId}`);
	return response.data;
};

export interface VaccinationDoneResponse {
	dogId: number;
	name: string;
	imageUrl: string;
	ageMonth: number;
}

export const fetchVaccinatedDogsAPI = async (
	vaccinationId: number,
	keyword?: string,
): Promise<VaccinationDoneResponse[]> => {
	const response = await localAxios.get(
		`/vaccinations/${vaccinationId}/done`,
		{
			params: { keyword },
		},
	);
	return response.data;
};

export const fetchNotYetVaccinatedDogsAPI = async (
	vaccinationId: number,
	keyword?: string,
): Promise<VaccinationDoneResponse[]> => {
	const response = await localAxios.get(
		`/vaccinations/${vaccinationId}/yet`,
		{
			params: { keyword },
		},
	);
	return response.data;
};

type VaccinationCompleteRequest = {
	dogIds: number[];
};

export const completeVaccinationAPI = async (
	vaccinationId: number,
	centerId: number,
	request: VaccinationCompleteRequest,
) => {
	const response = await localAxios.patch(
		`/vaccinations/${vaccinationId}`,
		request,
		{
			params: { centerId },
		},
	);
	return response.data;
};

export const saveVaccinationAPI = async (
	vaccinationId: number,
	centerId: string,
	request: VaccinationCompleteRequest,
) => {
	const response = await localAxios.post(
		`/vaccinations/${vaccinationId}`,
		request,
		{
			params: { centerId },
		},
	);
	return response.data;
};

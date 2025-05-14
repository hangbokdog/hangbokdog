import type { PageInfo } from "./http-commons";
import localAxios from "./http-commons";

export interface AdoptionApplicationResponse {
	adoptionId: number;
	dogId: number;
	dogName: string;
	dogImage: string;
	memberId: number;
	memberName: string;
	created_at: string;
}

export const fetchAdoptionApplicationsAPI = async (
	centerId: number,
	pageToken?: string,
): Promise<PageInfo<AdoptionApplicationResponse>> => {
	const response = await localAxios.get("/adoptions", {
		params: {
			centerId,
			pageToken,
		},
	});
	return response.data;
};

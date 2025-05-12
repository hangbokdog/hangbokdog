import type { ClosedVolunteerResponse, Volunteer } from "@/types/volunteer";
import localAxios from "./http-commons";

export const getLatestVolunteerAPI = async ({
	centerId,
}: {
	centerId: string;
}): Promise<Volunteer[]> => {
	const response = await localAxios.get<Volunteer[]>(
		`volunteers/latest?centerId=${centerId}`,
	);
	return response.data;
};

export const getVolunteerScheduleAPI = async ({
	centerId,
}: {
	centerId: string;
}): Promise<Volunteer[]> => {
	const response = await localAxios.get<Volunteer[]>(
		`volunteers?centerId=${centerId}`,
	);
	return response.data;
};

export const getClosedVolunteerAPI = async ({
	centerId,
	pageToken,
}: {
	centerId: string;
	pageToken?: string | null;
}): Promise<ClosedVolunteerResponse> => {
	const response = await localAxios.get<ClosedVolunteerResponse>(
		`volunteers/ended?centerId=${centerId}${pageToken ? `&pageToken=${pageToken}` : ""}`,
	);
	return response.data;
};

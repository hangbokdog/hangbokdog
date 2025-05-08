import type { Volunteer } from "@/types/volunteer";
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

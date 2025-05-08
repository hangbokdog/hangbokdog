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

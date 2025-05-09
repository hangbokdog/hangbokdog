import type { DogLatestResponse } from "@/types/dog";
import localAxios from "./http-commons";

export const createDogAPI = async (data: FormData) => {
	const response = await localAxios.post("/dogs", data, {
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

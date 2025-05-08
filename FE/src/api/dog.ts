import localAxios from "./http-commons";

export const createDogAPI = async (data: FormData) => {
	const response = await localAxios.post("/dogs", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

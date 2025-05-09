import localAxios from "./http-commons";

export interface centerCreateRequest {
	name: string;
	sponsorAmount: number;
}

export const createCenter = async (data: centerCreateRequest) => {
	const response = await localAxios.post("/centers", data);
	return response.data;
};

export const fetchCenters = async (name: string) => {
	const response = await localAxios.get("/centers/search", {
		params: { name },
	});
	return response.data;
};

export const fetchMyCenters = async () => {
	const response = await localAxios.get("/centers");
	return response.data;
};

export const fetchAddressBooks = async (centerId: string) => {
	const response = await localAxios.get(`/addressbooks/${centerId}`);
	return response.data;
};

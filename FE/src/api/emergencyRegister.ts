import localAxios from "@/api/http-commons";

export interface CreatePostType {
	name: string;
	description?: string;
}

export interface CreatePostTypeResponse {
	id: number;
	name: string;
	description?: string;
}

export interface CreatePost {
	postTypeId: number;
	title: string;
	content: string;
}
// export const createPostType = async (
// 	centerId: number,
// 	data: CreatePostType,
// ): Promise<CreatePostTypeResponse> => {
// 	const response = await localAxios.post("/post-types", data, {
// 		params: {
// 			centerId,
// 		},
// 	});
// 	return response.data;
// };

export const createPostTypeAPI = async (
	centerId: number,
	data: { name: string },
) => {
	const response = await localAxios.post("/post-types", data, {
		params: { centerId },
	});
	return response.data;
};

export const createPostAPI = async (data: CreatePost) => {
	const response = await localAxios.post("/posts", data);
	return response.data;
};

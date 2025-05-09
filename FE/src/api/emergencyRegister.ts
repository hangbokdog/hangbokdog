// src/api/post.ts
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

export const createPostType = async (
	centerId: number,
	data: { name: string },
) => {
	const response = await localAxios.post("/post-types", data, {
		params: { centerId },
	});
	return response.data;
};

export interface CreatePost {
	postTypeId: number;
	title: string;
	content: string;
}

export const createPost = async (data: CreatePost) => {
	const response = await localAxios.post("/posts", data);
	return response.data;
};

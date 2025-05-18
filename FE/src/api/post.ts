import localAxios, { type PageInfo } from "./http-commons";

export interface MemberInfo {
	id: number;
	nickName: string;
	grade: string;
	profileImage: string;
}

export interface PostCreateRequest {
	boardTypeId: number;
	dogId: number;
	title: string;
	content: string;
}

export interface PostResponse {
	author: MemberInfo;
	postType: PostTypeResponse;
	postId: number;
	dogId: number;
	title: string;
	content: string;
	images: string[];
	createdAt: string;
}

export interface PostTypeResponse {
	id: number;
	name: string;
}

export const createPostAPI = async (
	centerId: number,
	request: PostCreateRequest,
	files?: File[],
): Promise<PostResponse> => {
	const formData = new FormData();
	formData.append(
		"request",
		new Blob([JSON.stringify(request)], { type: "application/json" }),
	);

	if (files && files.length > 0) {
		for (const file of files) {
			formData.append("files", file);
		}
	}

	const response = await localAxios.post(
		`/posts?centerId=${centerId}`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};

export interface PostResponse {
	author: MemberInfo;
	postType: PostTypeResponse;
	postId: number;
	dogId: number;
	title: string;
	content: string;
	images: string[];
	createdAt: string;
}

export const fetchPostsAPI = async (
	pageToken?: string,
): Promise<PageInfo<PostResponse>> => {
	const response = await localAxios.get("/posts", {
		params: { pageToken },
	});

	return response.data;
};

export const fetchPostDetailAPI = async (
	postId: number,
): Promise<PostResponse> => {
	const response = await localAxios.get(`/posts/${postId}`);
	return response.data;
};

export interface PostUpdateRequest {
	dogId: number;
	title: string;
	content: string;
}

export const updatePostAPI = async (
	postId: number,
	request: PostUpdateRequest,
	files?: File[],
) => {
	const formData = new FormData();
	formData.append(
		"request",
		new Blob([JSON.stringify(request)], { type: "application/json" }),
	);

	if (files && files.length > 0) {
		for (const file of files) {
			formData.append("files", file);
		}
	}

	const response = await localAxios.patch(`/posts/${postId}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

export const deletePostAPI = async (postId: number) => {
	const response = await localAxios.delete(`/posts/${postId}`);
	return response.data;
};

export interface PostLikeResponse {
	isLiked: boolean;
}

export const toggleLikeAPI = async (postId: number) => {
	const response = await localAxios.post(`/posts/${postId}/like`);
	return response.data;
};

// 게시판 타입
export interface PostTypeResponse {
	id: number;
	name: string;
}

export interface PostTypeCreateRequest {
	name: string;
}

export interface PostTypeCreateResponse {
	id: number;
}

export const createPostTypeAPI = async (
	centerId: number,
	request: PostTypeCreateRequest,
): Promise<PostTypeCreateResponse> => {
	const response = await localAxios.post(
		`/post-types?centerId=${centerId}`,
		request,
	);
	return response.data;
};

export const fetchPostTypesAPI = async (
	centerId?: number,
): Promise<PostTypeResponse[]> => {
	const response = await localAxios.get("/post-types", {
		params: { centerId },
	});
	return response.data;
};

export const fetchPostTypeDetailAPI = async (
	postTypeId: number,
): Promise<PostTypeResponse> => {
	const response = await localAxios.get(`/post-types/${postTypeId}`);
	return response.data;
};

export const updatePostTypeAPI = async (
	postTypeId: number,
	centerId: number,
	request: PostTypeCreateRequest,
): Promise<void> => {
	const response = await localAxios.patch(
		`/post-types/${postTypeId}?centerId=${centerId}`,
		request,
	);
	return response.data;
};

export const deletePostTypeAPI = async (
	postTypeId: number,
	centerId: number,
): Promise<void> => {
	const response = await localAxios.delete(
		`/post-types/${postTypeId}?centerId=${centerId}`,
	);
	return response.data;
};

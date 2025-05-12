import localAxios from "@/api/http-commons";

// 게시판 생성 시 사용할 타입
export interface CreatePostTypeRequest {
	name: string;
}

// 게시글 생성 시 사용할 타입
export interface CreatePostRequest {
	boardTypeId: number;
	dogId: number;
	title: string;
	content: string;
	files?: File[];
}

export const createPostTypeAPI = async (
	centerId: number,
	data: CreatePostTypeRequest,
): Promise<{ boardTypeId: number }> => {
	const response = await localAxios.post("/post-types", data, {
		params: { centerId },
	});

	const location = response.headers.location ?? response.headers.Location;
	const id = Number(location?.split("/").pop());

	if (Number.isNaN(id)) {
		throw new Error("게시판 ID를 location 헤더에서 추출할 수 없습니다.");
	}

	return { boardTypeId: id };
};

// ✅ 게시글 등록 API
export const createPostAPI = async (
	centerId: number,
	data: CreatePostRequest,
) => {
	const formData = new FormData();

	// JSON payload를 'request' 필드로 감싸기
	const requestPayload = {
		boardTypeId: data.boardTypeId,
		dogId: data.dogId,
		title: data.title,
		content: data.content,
	};

	formData.append(
		"request",
		new Blob([JSON.stringify(requestPayload)], {
			type: "application/json",
		}),
	);

	if (data.files?.length) {
		for (const file of data.files) {
			formData.append("files", file);
		}
	}

	const response = await localAxios.post("/posts", formData, {
		params: { centerId },
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};

import axios from "axios";
import localAxios from "./http-commons";

export const uploadImageAPI = async (file: File) => {
	try {
		// FormData 생성
		const formData = new FormData();
		formData.append("file", file);

		// API 요청 (axios 사용)
		const response = await localAxios.post("/volunteers/images", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		// 서버에서 반환한 S3 이미지 URL 반환
		return response.data;
	} catch (error) {
		// 413 Request Entity Too Large 오류 처리
		if (axios.isAxiosError(error) && error.response?.status === 413) {
			throw new Error("파일 크기가 너무 큽니다 (최대 10MB)");
		}
		throw new Error("이미지 업로드에 실패했습니다");
	}
};

export const DogStatus = {
	HOSPITAL: "HOSPITAL",
	ADOPTED: "ADOPTED",
	FOSTERED: "FOSTERED",
	PROTECTED: "PROTECTED",
} as const;

export type DogStatus = (typeof DogStatus)[keyof typeof DogStatus];

export const DogLocation = {
	SHIMTTLE: "쉼뜰",
	SHIMTUH: "쉼터",
	STAR: "별",
};

export const Gender = {
	MALE: "MALE",
	FEMALE: "FEMALE",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const DogColor = {
	BEIGE: "BEIGE",
	BROWN: "BROWN",
	WHITE: "WHITE",
	GRAY: "GRAY",
	BLACK: "BLACK",
} as const;

export type DogColor = (typeof DogColor)[keyof typeof DogColor];

export const DogBreed = {
	JINDO: "JINDO",
	POODLE: "POODLE",
	MALTESE: "MALTESE",
	SHIH_TZU: "SHIH_TZU",
	GOLDEN_RETRIEVER: "GOLDEN_RETRIEVER",
	LABRADOR: "LABRADOR",
	BEAGLE: "BEAGLE",
	BICHON: "BICHON",
	MIXED: "MIXED",
	DACHSHUND: "DACHSHUND",
	SCHNAUZER: "SCHNAUZER",
	SPITZ: "SPITZ",
	YORKSHIRE_TERRIER: "YORKSHIRE_TERRIER",
	COCKER_SPANIEL: "COCKER_SPANIEL",
	PEKINGESE: "PEKINGESE",
	POMERANIAN: "POMERANIAN",
	CHIHUAHUA: "CHIHUAHUA",
	OTHER: "OTHER",
} as const;

export type DogBreed = (typeof DogBreed)[keyof typeof DogBreed];

export const DogStatusLabel: Record<DogStatus, string> = {
	HOSPITAL: "병원",
	ADOPTED: "입양",
	FOSTERED: "임시보호",
	PROTECTED: "보호중",
};

export const GenderLabel: Record<Gender, string> = {
	FEMALE: "여아",
	MALE: "남아",
};

export const DogColorLabel: Record<DogColor, string> = {
	BEIGE: "베이지",
	BROWN: "갈색",
	WHITE: "흰색",
	GRAY: "회색",
	BLACK: "검정색",
};

export const DogColorBgClass: Record<DogColor, string> = {
	BEIGE: "bg-amber-200",
	BROWN: "bg-amber-800",
	WHITE: "bg-gray-100",
	GRAY: "bg-gray-500",
	BLACK: "bg-black",
};

export const DogBreedLabel: Record<DogBreed, string> = {
	JINDO: "진돗개",
	POODLE: "푸들",
	MALTESE: "말티즈",
	SHIH_TZU: "시츄",
	GOLDEN_RETRIEVER: "골든리트리버",
	LABRADOR: "래브라도",
	BEAGLE: "비글",
	BICHON: "비숑",
	MIXED: "믹스",
	DACHSHUND: "닥스훈트",
	SCHNAUZER: "슈나우저",
	SPITZ: "스피츠",
	YORKSHIRE_TERRIER: "요크셔테리어",
	COCKER_SPANIEL: "코커스패니얼",
	PEKINGESE: "페키니즈",
	POMERANIAN: "포메라니안",
	CHIHUAHUA: "치와와",
	OTHER: "기타",
};

export interface DogCreateRequest {
	status: DogStatus;
	centerId: number;
	name: string;
	breed: DogBreed;
	color: string[];
	rescuedDate: string;
	weight: number;
	description: string;
	gender: Gender;
	isNeutered: boolean;
	breedDetail?: string;
}

export interface DogLatestResponse {
	count: number;
	dogSummaries: DogSummary[];
}

export interface DogSummary {
	dogId: number;
	name: string;
	imageUrl: string;
	ageMonth: number;
	gender: string;
	isFavorite: boolean;
}

export const MedicalType = {
	SURGERY: "SURGERY",
	MEDICATION: "MEDICATION",
};

export type MedicalType = (typeof MedicalType)[keyof typeof MedicalType];

export const MedicalTypeLabel: Record<MedicalType, string> = {
	SURGERY: "수술",
	MEDICATION: "약물치료",
};

export interface DogCommentAuthor {
	id: number;
	nickName: string;
	grade: string;
	profileImage: string;
}

export interface DogCommentData {
	author: DogCommentAuthor;
	isAuthor: boolean;
	id: number;
	parentId: number | null;
	content: string;
	isDeleted: boolean;
	createdAt: string;
	isLiked: boolean;
	likeCount: number;
}

export interface DogCommentItem {
	dogComment: DogCommentData;
	replies: {
		dogComment: DogCommentData;
		replies: DogCommentItem[];
	}[];
}

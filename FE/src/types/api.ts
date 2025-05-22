export interface PageInfo<T> {
	items: T[];
	pageToken?: string;
	hasNext: boolean;
}

export interface DogSearchResponse {
	dogId: number;
	dogName: string;
	age: number;
	profileImageUrl: string;
	gender: "MALE" | "FEMALE";
	createdAt: string;
	breed: string;
	isNeutered: boolean;
	location: string;
}

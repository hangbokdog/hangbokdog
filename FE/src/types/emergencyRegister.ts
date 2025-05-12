export type TargetGrade = "ALL" | "VOLUNTEER" | "DONOR";

export interface TransportRequest {
	title: string;
	content: string;
	dueDate: string; // ISO 8601 형식
	targetGrade: TargetGrade;
}

export interface DonationRequest {
	title: string;
	content: string;
	dueDate: string;
	targetAmount: number;
	targetGrade: TargetGrade;
}

export interface VolunteerRequest {
	title: string;
	content: string;
	dueDate: string;
	capacity: number;
	targetGrade: TargetGrade;
}

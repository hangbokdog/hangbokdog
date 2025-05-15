export enum TargetGrade {
	ALL = "ALL",
	USER = "USER",
	MANAGER = "MANAGER",
}

export enum EmergencyType {
	TRANSPORT = "TRANSPORT",
	DONATION = "DONATION",
	VOLUNTEER = "VOLUNTEER",
}

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

export interface EmergencyPostResponse {
	emergencyId: number;
}

export interface EmergencyPost {
	emergencyId: number;
	centerId: number;
	authorId: number;
	name: string;
	title: string;
	content: string;
	memberImage: string;
	dueDate: string;
	capacity?: number;
	targetAmount?: number;
	type: EmergencyType;
}

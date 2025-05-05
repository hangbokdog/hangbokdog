export interface ScheduleItem {
	date: string;
	morning: string;
	afternoon: string;
}

export interface Participant {
	nickname: string;
	name: string;
	phone: string;
}

export interface SelectedSchedule {
	date: string;
	time: "morning" | "afternoon";
	capacity: string;
	people: number;
	participants: Participant[];
}

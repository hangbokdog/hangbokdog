export interface MovingRegisterForm {
	dogName: string;
	currentLocation: string;
	destinationLocation: string;
	date: string;
	description: string;
}

export interface DonationRegisterForm {
	title: string;
	donation: number;
	date: string;
	description: string;
}

export interface VolunteerRegisterForm {
	title: string;
	people: number;
	location: string;
	date: string;
	description: string;
}

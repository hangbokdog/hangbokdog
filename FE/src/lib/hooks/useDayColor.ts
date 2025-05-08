export const useDayColor = (month: number, day: number) => {
	const date = new Date(2024, month - 1, day);
	const dayOfWeek = date.getDay();

	if (dayOfWeek === 0) return "text-red";
	if (dayOfWeek === 6) return "text-blue";
	return "text-primary";
};

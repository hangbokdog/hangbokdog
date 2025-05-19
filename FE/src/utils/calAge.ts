export const calAge = (ageMonth: number) => {
	return Number(ageMonth) >= 12
		? `${Math.floor(Number(ageMonth) / 12)}살`
		: `${ageMonth}개월`;
};

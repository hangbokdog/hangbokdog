export function useFormatDate() {
	const formatBirthDate = (birthDate: string): string => {
		if (birthDate.length !== 6) return "";

		const yy = birthDate.substring(0, 2);
		const mm = birthDate.substring(2, 4);
		const dd = birthDate.substring(4, 6);

		const currentYear = new Date().getFullYear() % 100;
		const prefix = Number.parseInt(yy) > currentYear ? "19" : "20";

		return `${prefix}${yy}-${mm}-${dd}`;
	};

	return { formatBirthDate };
}

// 날짜 포맷팅 함수
export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "short",
	});
};

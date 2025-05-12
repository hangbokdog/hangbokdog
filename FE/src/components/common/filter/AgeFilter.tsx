import DogAgeSlider from "../../dog/DogAgeSlider";

interface AgeFilterProps {
	startDate?: string;
	endDate?: string;
	onDateChange: (start?: string, end?: string) => void;
}

// Helper functions (moved from Search component)
const datesToSliderValues = (
	start?: string,
	end?: string,
): [number, number] => {
	if (!start || !end) {
		return [0, 25];
	}

	const currentDate = new Date();
	const startDate = new Date(start);
	const endDate = new Date(end);

	const monthsAgoStart = differenceInMonths(currentDate, startDate);
	const monthsAgoEnd = differenceInMonths(currentDate, endDate);

	const sliderMin = monthsToSliderValue(monthsAgoEnd);
	const sliderMax = monthsToSliderValue(monthsAgoStart);

	return [sliderMin, sliderMax];
};

const differenceInMonths = (a: Date, b: Date): number => {
	const yearDiff = a.getFullYear() - b.getFullYear();
	const monthDiff = a.getMonth() - b.getMonth();
	return yearDiff * 12 + monthDiff;
};

const monthsToSliderValue = (months: number): number => {
	if (months <= 11) {
		return months - 1;
	}
	const years = Math.floor(months / 12);
	return 10 + years;
};

export default function AgeFilter({
	startDate,
	endDate,
	onDateChange,
}: AgeFilterProps) {
	return (
		<div className="w-full">
			<DogAgeSlider
				value={datesToSliderValues(startDate, endDate)}
				onValueChange={() => onDateChange(undefined, undefined)}
				startDate={startDate}
				endDate={endDate}
				onDateChange={onDateChange}
			/>
		</div>
	);
}

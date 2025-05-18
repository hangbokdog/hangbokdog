import DogAgeSlider from "../../dog/DogAgeSlider";
import { useEffect, useState } from "react";

interface AgeFilterProps {
	startDate?: string;
	endDate?: string;
	onDateChange: (start?: string, end?: string) => void;
	getAge: (ageVariable: string) => void;
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
	getAge,
}: AgeFilterProps) {
	const [sliderValues, setSliderValues] = useState<[number, number]>([0, 25]);

	// Update slider values when props change
	useEffect(() => {
		setSliderValues(datesToSliderValues(startDate, endDate));

		// If filter is reset, also update age text
		if (!startDate && !endDate) {
			getAge("전체 나이");
		}
	}, [startDate, endDate, getAge]);

	const handleValueChange = (newValues: [number, number]) => {
		setSliderValues(newValues);
	};

	return (
		<div className="w-full">
			<DogAgeSlider
				value={sliderValues}
				onValueChange={handleValueChange}
				startDate={startDate}
				endDate={endDate}
				onDateChange={onDateChange}
				getAge={getAge}
			/>
		</div>
	);
}

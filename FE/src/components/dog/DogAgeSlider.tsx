import { DualRangeSlider } from "@/components/ui/dualRangeSlider";

interface DogAgeSliderProps {
	value: [number, number];
	onValueChange: (value: [number, number]) => void;
	startDate?: string;
	endDate?: string;
	onDateChange?: (start: string, end: string) => void;
	getAge?: (ageVariable: string) => void;
}

export default function DogAgeSlider({
	value,
	onValueChange,
	onDateChange,
	getAge,
}: DogAgeSliderProps) {
	const sliderValueToMonths = (value: number): number => {
		if (value <= 10) {
			return value + 1;
		}
		return (value - 10) * 12;
	};

	const subtractMonths = (date: Date, months: number): Date => {
		const result = new Date(date);
		result.setMonth(result.getMonth() - months);
		return result;
	};

	const formatDate = (date: Date): string => {
		const pad = (num: number) => num.toString().padStart(2, "0");
		return (
			`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
			`${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
		);
	};

	const handleValueChange = (newValues: [number, number]) => {
		onValueChange(newValues);

		if (onDateChange) {
			const [minSlider, maxSlider] = newValues;
			const minMonths = sliderValueToMonths(minSlider);
			const maxMonths = sliderValueToMonths(maxSlider);

			const currentDate = new Date();
			const start = subtractMonths(currentDate, maxMonths);
			const end = subtractMonths(currentDate, minMonths);

			onDateChange(formatDate(start), formatDate(end));
		}

		// Format the age range for display in filter tags
		if (getAge) {
			const [minSlider, maxSlider] = newValues;
			const minAgeText = getLabel(minSlider);
			const maxAgeText = getLabel(maxSlider);

			// Format the age range text
			let ageRangeText = "";
			if (minSlider === 0 && maxSlider === 25) {
				ageRangeText = "전체 나이";
			} else if (minSlider === maxSlider) {
				ageRangeText = `${minAgeText}`;
			} else {
				ageRangeText = `${minAgeText} 부터 ${maxAgeText}`;
			}

			getAge(ageRangeText);
		}
	};

	const getLabel = (value: number | undefined) => {
		if (value === undefined) return "";
		if (value <= 10) {
			return `${value + 1}개월`;
		}
		const years = value - 10;
		return `${years}살`;
	};

	return (
		<div className="w-full px-10">
			<DualRangeSlider
				label={getLabel}
				value={value}
				onValueChange={handleValueChange}
				min={0}
				max={25}
				step={1}
			/>
		</div>
	);
}

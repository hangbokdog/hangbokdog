import {
	DogStatusLabel,
	type DogStatus as DogStatusType,
	Gender,
	GenderLabel,
} from "@/types/dog";

interface DogStatusProps {
	status: DogStatusType;
	gender: Gender;
}

export default function DogStatus({ status, gender }: DogStatusProps) {
	return (
		<div className="flex gap-2">
			<span className="flex px-2.5 py-0.5 font-semibold text-white bg-green rounded-full">
				{DogStatusLabel[status]}
			</span>
			<span
				className={`flex px-2.5 py-0.5 font-semibold text-white ${gender === Gender.FEMALE ? "bg-female" : "bg-male"} rounded-full`}
			>
				{GenderLabel[gender]}
			</span>
		</div>
	);
}

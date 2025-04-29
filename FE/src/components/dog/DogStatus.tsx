interface DogStatusProps {
	status: string;
	gender: string;
}

export default function DogStatus({ status, gender }: DogStatusProps) {
	return (
		<div className="flex gap-2">
			<span className="flex px-2.5 py-0.5 font-semibold text-white bg-green rounded-full">
				{status}
			</span>
			<span className="flex px-2.5 py-0.5 font-semibold text-white bg-female rounded-full">
				{gender}
			</span>
		</div>
	);
}

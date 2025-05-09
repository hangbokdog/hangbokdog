import { Skeleton } from "../ui/skeleton";

export function DogPanelSkeleton() {
	return (
		<div className="p-2.5 mx-2.5 bg-white rounded-lg flex flex-col gap-2.5">
			<div className="flex justify-between items-center">
				<Skeleton className="h-8 w-40 bg-gray-200" />
				<Skeleton className="h-4 w-10 bg-gray-200" />
			</div>
			<div className="grid grid-cols-3 gap-3">
				<Skeleton className="h-32 w-full my-2 rounded-lg bg-gray-200" />
				<Skeleton className="h-32 w-full my-2 rounded-lg bg-gray-200" />
				<Skeleton className="h-32 w-full my-2 rounded-lg bg-gray-200" />
			</div>
		</div>
	);
}

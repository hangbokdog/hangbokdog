import { Skeleton } from "@/components/ui/skeleton";

export function VolunteerPanelSkeleton() {
	return (
		<div className="p-2.5 mx-2.5 bg-white rounded-lg flex flex-col gap-3">
			<div className="flex justify-between items-center">
				<Skeleton className="h-8 w-40 bg-gray-200" />
				<Skeleton className="h-4 w-10 bg-gray-200" />
			</div>
			<div className="flex flex-col">
				<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
				<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
				<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
			</div>
		</div>
	);
}

export function CalendarSkeleton() {
	return (
		<div className="rounded-lg overflow-hidden">
			<Skeleton className="h-8 w-40 bg-gray-200" />
			<Skeleton className="h-64 w-full mt-2 bg-gray-200" />
		</div>
	);
}

export function OngoingVolunteerSkeleton() {
	return (
		<div>
			<div className="mb-2">
				<Skeleton className="h-7 w-40 bg-gray-200" />
			</div>
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
		</div>
	);
}

export function ClosedVolunteerSkeleton() {
	return (
		<div>
			<div className="mb-2">
				<Skeleton className="h-7 w-40 bg-gray-200" />
			</div>
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
			<Skeleton className="h-24 w-full my-2 rounded-lg bg-gray-200" />
		</div>
	);
}

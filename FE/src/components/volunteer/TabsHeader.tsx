import { TabsTrigger } from "../ui/tabs";

interface TabsHeaderProps {
	value: string;
	title: string;
}

export default function TabsHeader({ value, title }: TabsHeaderProps) {
	return (
		<TabsTrigger
			value={value}
			className="flex-1 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=inactive]:text-lightGray data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none hover:bg-transparent data-[state=active]:shadow-none"
		>
			{title}
		</TabsTrigger>
	);
}

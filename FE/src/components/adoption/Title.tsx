interface TitleProps {
	children: React.ReactNode;
	className?: string;
}

export default function Title({ children, className = "" }: TitleProps) {
	return (
		<span className={`text-2xl font-bold text-center ${className}`}>
			{children}
		</span>
	);
}

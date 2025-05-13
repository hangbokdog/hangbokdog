import { useEffect, useRef, useState } from "react";

export default function PillProgress() {
	const completed = 543;
	const pending = 225;
	const total = completed + pending;
	const targetProgress = (completed / total) * 100;

	const [progress, setProgress] = useState(0);
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		let start: number | null = null;
		const duration = 1000;

		const animate = (timestamp: number) => {
			if (!start) start = timestamp;
			const elapsed = timestamp - start;
			const progressValue = Math.min(
				(targetProgress * elapsed) / duration,
				targetProgress,
			);
			setProgress(progressValue);
			if (elapsed < duration) {
				animationRef.current = requestAnimationFrame(animate);
			}
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current !== null) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [targetProgress]);

	const radius = 30;
	const circumference = 2 * Math.PI * radius;

	return (
		<div className="relative w-20 h-20">
			<svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]">
				<title>Pill progress visualization</title>
				<circle
					cx="50%"
					cy="50%"
					r={radius}
					stroke="#E5E7EB"
					strokeWidth="6"
					fill="none"
				/>
				<circle
					cx="50%"
					cy="50%"
					r={radius}
					stroke="#3B82F6"
					strokeWidth="6"
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={
						circumference - (circumference * progress) / 100
					}
					strokeLinecap="round"
				/>
			</svg>

			<img
				src="/src/assets/images/pills.svg"
				alt="pill"
				className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
		</div>
	);
}

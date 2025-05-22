import { useEffect, useRef, useState } from "react";

interface PillProgressProps {
	completed: number;
	pending: number;
}

export default function PillProgress({
	completed,
	pending,
}: PillProgressProps) {
	const total = completed + pending;
	const targetProgress = (completed / total) * 100 || 0;

	const [progress, setProgress] = useState(0);
	const animationRef = useRef<number | null>(null);

	useEffect(() => {
		let start: number | null = null;
		const duration = 1200;

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

	const radius = 35;
	const strokeWidth = 7;
	const normalizedRadius = radius - strokeWidth / 2;
	const circumference = 2 * Math.PI * normalizedRadius;
	const completedPercentage = Math.round(targetProgress);

	return (
		<div className="relative w-28 h-28 flex items-center justify-center">
			<svg
				className="w-full h-full rotate-[-90deg]"
				aria-labelledby="progressTitle"
			>
				<title id="progressTitle">백신 접종 진행 상태</title>
				<defs>
					<linearGradient
						id="progressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="#3b82f6" />
						<stop offset="100%" stopColor="#60a5fa" />
					</linearGradient>
					<filter id="glow">
						<feGaussianBlur
							stdDeviation="2.5"
							result="coloredBlur"
						/>
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Background Circle */}
				<circle
					cx="50%"
					cy="50%"
					r={normalizedRadius}
					stroke="#E5E7EB"
					strokeWidth={strokeWidth}
					fill="none"
				/>

				{/* Progress Circle */}
				<circle
					cx="50%"
					cy="50%"
					r={normalizedRadius}
					stroke="url(#progressGradient)"
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={
						circumference - (circumference * progress) / 100
					}
					strokeLinecap="round"
					filter="url(#glow)"
					className="transition-all duration-300 ease-out"
				/>
			</svg>

			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<div className="flex items-center justify-center w-20 h-20 rounded-full bg-superLightBlueGray shadow-inner">
					<div className="text-center">
						<div className="text-blue-600 text-2xl font-bold">
							{completedPercentage}%
						</div>
						<div className="text-xs text-gray-500">완료</div>
					</div>
				</div>
			</div>
		</div>
	);
}

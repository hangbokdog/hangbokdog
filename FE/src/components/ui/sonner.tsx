import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ richColors, ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			duration={1500}
			richColors={richColors}
			toastOptions={{
				classNames: {
					toast: richColors
						? "group-[.toaster]:border group-[.toaster]:shadow-lg"
						: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					success: richColors
						? "group-[.toaster]:bg-green-500 group-[.toaster]:text-white group-[.toaster]:border-green-600"
						: "",
					error: richColors
						? "group-[.toaster]:bg-red-500 group-[.toaster]:text-white group-[.toaster]:border-red-600"
						: "",
					warning: richColors
						? "group-[.toaster]:bg-yellow-500 group-[.toaster]:text-white group-[.toaster]:border-yellow-600"
						: "",
					info: richColors
						? "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white group-[.toaster]:border-blue-600"
						: "",
				},
				...props.toastOptions,
			}}
			{...props}
		/>
	);
};

export { Toaster };

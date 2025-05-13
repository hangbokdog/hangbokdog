import {
	useState,
	createContext,
	useContext,
	type ReactNode,
	Children,
	type ReactElement,
} from "react";
import { Link } from "react-router-dom";

interface TabsContextType {
	activeTabKey: string;
	setActiveTabKey: (key: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
	children: ReactNode;
	defaultActiveKey?: string;
	moreLink?: string;
}

export function Tabs({ children, defaultActiveKey, moreLink }: TabsProps) {
	const [activeTabKey, setActiveTabKey] = useState(() => {
		if (defaultActiveKey) return defaultActiveKey;

		const childrenArray = Children.toArray(children);
		const tabList = childrenArray.find(
			(child) => (child as ReactElement).type === TabList,
		) as ReactElement<{ children: ReactNode }> | undefined;

		if (!tabList) throw new Error("Tabs requires a TabList");

		const tabListChildren = Children.toArray(tabList.props.children);
		const firstTab = tabListChildren.find(
			(tab) => (tab as ReactElement).type === Tab,
		) as ReactElement<TabProps> | undefined;

		if (!firstTab) throw new Error("TabList requires at least one Tab");

		return firstTab.props.tabKey;
	});

	return (
		<TabsContext.Provider value={{ activeTabKey, setActiveTabKey }}>
			<div className="flex flex-col">
				<div className="flex flex-1 flex-col items-center p-2 gap-3 rounded-lg bg-white">
					{children}
					{moreLink && (
						<Link to={moreLink}>
							<span className="text-grayText font-bold text-sm">
								더보기
							</span>
						</Link>
					)}
				</div>
			</div>
		</TabsContext.Provider>
	);
}

export function TabList({ children }: { children: ReactNode }) {
	const context = useContext(TabsContext);
	if (!context) throw new Error("TabList must be used within Tabs");

	const childrenArray = Children.toArray(children);
	const activeIndex = childrenArray.findIndex(
		(child) =>
			(child as ReactElement<TabProps>).props.tabKey ===
			context.activeTabKey,
	);

	return (
		<div
			role="tablist"
			className="relative flex w-full justify-around mb-2"
		>
			{children}
			{childrenArray.length > 0 && (
				<div
					className="absolute bottom-0 h-1 bg-background rounded-full transition-all duration-300"
					style={{
						width: `${100 / childrenArray.length}%`,
						left: `${(activeIndex * 100) / childrenArray.length}%`,
					}}
				/>
			)}
		</div>
	);
}
TabList.displayName = "TabList";

interface TabProps {
	tabKey: string;
	children: ReactNode;
}

export function Tab({ tabKey, children }: TabProps) {
	const context = useContext(TabsContext);
	if (!context) throw new Error("Tab must be used within Tabs");

	return (
		<button
			type="button"
			role="tab"
			aria-selected={context.activeTabKey === tabKey}
			className={`flex-1 py-2 text-center font-bold rounded-full z-10 ${
				context.activeTabKey === tabKey ? "text-black" : "text-grayText"
			}`}
			onClick={() => context.setActiveTabKey(tabKey)}
		>
			{children}
		</button>
	);
}
Tab.displayName = "Tab";

export function TabPanels({ children }: { children: ReactNode }) {
	return <div className="flex flex-col w-full gap-2">{children}</div>;
}

interface TabPanelProps {
	tabKey: string;
	children: ReactNode;
}

export function TabPanel({ tabKey, children }: TabPanelProps) {
	const context = useContext(TabsContext);
	if (!context) throw new Error("TabPanel must be used within Tabs");

	return context.activeTabKey === tabKey ? <>{children}</> : null;
}

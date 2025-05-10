import { create } from "zustand";

interface Center {
	centerId: string;
	centerName: string;
	status: string;
	centerJoinRequestId?: string;
}

interface CenterState {
	selectedCenter: Center | null;
	isCenterMember: boolean;
	setSelectedCenter: (center: Center) => void;
	setIsCenterMember: (isMember: boolean) => void;
	clearSelectedCenter: () => void;
}

const getStoredCenter = (): Center | null => {
	const stored = sessionStorage.getItem("selectedCenter");
	return stored ? JSON.parse(stored) : null;
};

const getStoredCenterMember = (): boolean => {
	const stored = sessionStorage.getItem("isCenterMember");
	return stored === "true";
};

const useCenterStore = create<CenterState>()((set) => ({
	selectedCenter: getStoredCenter(),
	isCenterMember: getStoredCenterMember(),
	setSelectedCenter: (center: Center) => {
		sessionStorage.setItem("selectedCenter", JSON.stringify(center));
		set({ selectedCenter: center });
	},
	setIsCenterMember: (isMember: boolean) => {
		sessionStorage.setItem("isCenterMember", isMember.toString());
		set({ isCenterMember: isMember });
	},
	clearSelectedCenter: () => {
		sessionStorage.removeItem("selectedCenter");
		sessionStorage.removeItem("isCenterMember");
		set({ selectedCenter: null, isCenterMember: false });
	},
}));

export default useCenterStore;

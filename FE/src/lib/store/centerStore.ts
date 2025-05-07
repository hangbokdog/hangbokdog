import { create } from "zustand";

interface CenterState {
	selectedCenterId: number | null;
	isCenterMember: boolean;
	setSelectedCenter: (centerId: number) => void;
	setIsCenterMember: (isMember: boolean) => void;
	clearSelectedCenter: () => void;
}

const getStoredCenterId = (): number | null => {
	const stored = sessionStorage.getItem("selectedCenterId");
	return stored ? Number(stored) : null;
};

const getStoredCenterMember = (): boolean => {
	const stored = sessionStorage.getItem("isCenterMember");
	return stored === "true";
};

const useCenterStore = create<CenterState>()((set) => ({
	selectedCenterId: getStoredCenterId(),
	isCenterMember: getStoredCenterMember(),
	setSelectedCenter: (centerId: number) => {
		sessionStorage.setItem("selectedCenterId", centerId.toString());
		set({ selectedCenterId: centerId });
	},
	setIsCenterMember: (isMember: boolean) => {
		sessionStorage.setItem("isCenterMember", isMember.toString());
		set({ isCenterMember: isMember });
	},
	clearSelectedCenter: () => {
		sessionStorage.removeItem("selectedCenterId");
		sessionStorage.removeItem("isCenterMember");
		set({ selectedCenterId: null, isCenterMember: false });
	},
}));

export default useCenterStore;

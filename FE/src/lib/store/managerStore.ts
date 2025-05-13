import type { AddressBook } from "@/api/center";
import { create } from "zustand";

interface ManagerState {
	addressBook: AddressBook[];
	setAddressBook: (addressBooks: AddressBook[]) => void;
	addAddressBook: (newAddress: AddressBook) => void;
	removeAddressBook: (id: number) => void;
	clearAddressBook: () => void;
}

const getStoredAddressBook = (): AddressBook[] => {
	const stored = sessionStorage.getItem("addressBook");
	return stored ? JSON.parse(stored) : [];
};

const useManagerStore = create<ManagerState>()((set) => ({
	addressBook: getStoredAddressBook(),
	setAddressBook: (addressBooks: AddressBook[]) => {
		sessionStorage.setItem("addressBook", JSON.stringify(addressBooks));
		set({ addressBook: addressBooks });
	},
	addAddressBook: (newAddress: AddressBook) => {
		set((state) => {
			const updatedAddressBook = [...state.addressBook, newAddress];
			sessionStorage.setItem(
				"addressBook",
				JSON.stringify(updatedAddressBook),
			);
			return { addressBook: updatedAddressBook };
		});
	},
	removeAddressBook: (id: number) => {
		set((state) => {
			const updatedAddressBook = state.addressBook.filter(
				(item) => item.id !== id,
			);
			sessionStorage.setItem(
				"addressBook",
				JSON.stringify(updatedAddressBook),
			);
			return { addressBook: updatedAddressBook };
		});
	},
	clearAddressBook: () => {
		sessionStorage.removeItem("addressBook");
		set({ addressBook: [] });
	},
}));

export default useManagerStore;

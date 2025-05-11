import AddressBookPanel from "@/components/manager/center/AddressBookPanel";
import RequestPanel from "@/components/manager/center/RequestPanel";

export default function CenterManagerMainPage() {
	return (
		<div className="mx-2.5 gap-4.5 flex flex-col">
			<AddressBookPanel />
			<RequestPanel />
		</div>
	);
}

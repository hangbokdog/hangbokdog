import { MdSend } from "react-icons/md";

interface MovingListItemProps {
    name: string;
    startLocation: string;
    endLocation: string;
    date: string;
    index: number;
}

export default function MovingListItem(props: MovingListItemProps) {
    const { name, startLocation, endLocation, date, index } = props;

    return (
        <div className={`flex rounded-full ${ index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}>
            <div className="w-8 text-[var(--color-blueGray)] font-semibold">
                {name}
            </div>
            <div className="flex-1/2 flex justify-center items-center gap-2.5">
                <div className="flex-1/3 text-center">
                    {startLocation}
                </div>
                <div className="flex-1">
                    <MdSend className="text-[var(--color-lightGray)]" />
                </div>
                <div className="flex-1/3 text-center">
                    {endLocation}
                </div>
            </div>
            <div className="w-16 font-light text-[var(--color-blueGray)] text-start">
                {date}
            </div>
        </div>
    )
}
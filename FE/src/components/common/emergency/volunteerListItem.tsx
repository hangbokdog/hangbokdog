interface VolunteerListItemProps {
    title: string;
    current: number;
    target: number;
    date: string;
    index: number;
}

export default function VolunteerListItem(props: VolunteerListItemProps) {
    const { title, current, target, date, index } = props;

    return (
        <div className={`flex rounded-full ${ index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}>
            <div className="flex-1/3">
                {title}
            </div>
            <div className="flex-1 text-center">
                {current} / {target} 명
            </div>
            <div className="w-16 font-light text-[var(--color-blueGray)]">
                {date}
            </div>
        </div>
    )
}
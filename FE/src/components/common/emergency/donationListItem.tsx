interface DonationListItemProps {
    title: string;
    current: number;
    target: number;
    date: string;
    index: number;
}

export default function DonationListItem(props: DonationListItemProps) {
    const { title, current, target, date, index } = props;

    const progress = Math.min((current / target) * 100, 100);

    return (
        <div className={`flex rounded-full ${ index % 2 === 1 && "bg-background"} text-grayText text-base font-medium items-center px-5 py-1`}>
            <div className="flex-1 text-[grayBlue]">
                {title}
            </div>
            <div className="flex-1 flex items-center pr-4">
                <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#84A7FB]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="w-16 font-light text-[var(--color-blueGray)] text-start">
                {date}
            </div>
        </div>
    )
}
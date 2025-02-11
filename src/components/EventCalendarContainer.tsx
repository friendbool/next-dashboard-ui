import Image from "next/image"
import EventList from "./EventList"
import EventCalendar from "./EventCalendar"

const EventCalendarContainer = async ({dateParam}: {dateParam: string | undefined}) => {
    return (
        <div className="bg-white p-4 rounded-md">
            <EventCalendar />
            <div className="flex items-center justify-between">
                <h1 className='text-xl font-semibold my-4'>Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
                <EventList dateValue={dateParam} />
            </div>
        </div>
    )
}

export default EventCalendarContainer
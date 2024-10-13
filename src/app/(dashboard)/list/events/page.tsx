import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import { eventsData, role } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { Class, Event, Prisma } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type EventList = Event & { class: Class }

const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Start Time", accessor: "startTime", className: "hidden lg:table-cell" },
    { header: "End Time", accessor: "endTime", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
]

const renderRow = (item: EventList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.title}</h3>
            </div>
        </td>
        <td>{item.class.name}</td>
        <td className="hidden md:table-cell">{item.startTime.toLocaleDateString()}</td>
        <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false})}</td>
        <td className="hidden md:table-cell">{item.endTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false})}</td>
        <td>
            <div className="flex items-center gap-2">

                {role === "admin" &&
                    // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
                    //     <Image src={"/delete.png"} alt="" width={16} height={16} />
                    // </button>
                    <>
                        <FormModal table="event" type="update" data={item} id={item.id} />
                        <FormModal table="event" type="delete" id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
}

const EventListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.EventWhereInput = {}

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
            switch (key) {
                case "classId":
                    where.classId = parseInt(value)
                    break;
                case "search":
                    where.title = { contains: value, mode: "insensitive" }
                    break;
            }
        }
    }

    const [eventsData, count] = await prisma.$transaction([
        prisma.event.findMany({
            where: where,
            include: {
                class: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.event.count({
            where: where
        })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeach />
                    <div className="self-end flex items-center gap-4">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" &&
                            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            //     <Image src="/plus.png" alt="" width={14} height={14} />
                            // </button>
                            <FormModal table="event" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={eventsData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default EventListPage
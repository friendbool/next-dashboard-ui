import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { currentUserId, role } from "@/lib/util"
import { auth } from "@clerk/nextjs/server"
import { Announcement, Class, Prisma } from "@prisma/client"
import Image from "next/image"

type AnnouncmentList = Announcement & { class: Class }

const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
]


const renderRow = (item: AnnouncmentList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.title}</h3>
            </div>
        </td>
        <td>{item.class?.name || "-"}</td>
        <td className="hidden md:table-cell">{item.date.toLocaleDateString()}</td>
        <td>
            <div className="flex items-center gap-2">
                {/* <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src={"/edit.png"} alt="" width={16} height={16} />
                    </button>
                </Link> */}
                {role === "admin" &&
                    <>
                        <FormModal table="announcement" type="update" data={item} id={item.id} />
                        <FormModal table="announcement" type="delete" id={item.id} />
                    </>

                }
            </div>
        </td>
    </tr>
}

const AnnouncementListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.AnnouncementWhereInput = {}

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

    // FILTRI DI SESSIONE
    switch (role) {
        case "admin":
            break;
        case "teacher":
            where.OR = [
                { class: { lesson: { some: { teacherId: currentUserId } } } },
                { classId: null }
            ]
            break;
        case "student":
            where.OR = [
                { class: { students: { some: { id: currentUserId! }, } } },
                { classId: null }
            ]
            break;
        case "parent":
            where.OR = [
                { class: { students: { some: { parentId: currentUserId! } } } },
                { classId: null }
            ]
            break;
    }

    const [announcementsData, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: where,
            include: {
                class: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.announcement.count({
            where: where
        })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
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
                            <FormModal table="announcement" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={announcementsData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default AnnouncementListPage
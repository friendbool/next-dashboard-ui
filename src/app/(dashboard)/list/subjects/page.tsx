import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import { role, subjectsData } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type SubjectList = Subject & { teachers: Teacher[] }

const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
]

const renderRow = (item: SubjectList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.teachers.map(i=> i.name).join(',')}</td>
        <td>
            <div className="flex items-center gap-2">
                {/* <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src={"/edit.png"} alt="" width={16} height={16} />
                    </button>
                </Link> */}
                {role === "admin" &&
                    // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
                    //     <Image src={"/delete.png"} alt="" width={16} height={16} />
                    // </button>
                    <>
                        <FormModal table="subject" type="update" data={item} id={item.id} />
                        <FormModal table="subject" type="delete" id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
}

const SubjectListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.SubjectWhereInput = {}

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
            switch (key) {
                // case "teacherId":
                //     where.class = {
                //         lesson: {
                //             some: { teacherId: value }
                //         }
                //     }
                //     break;
                case "search":
                    where.name = { contains: value, mode: "insensitive" }
                    break;
                default:
                    break;
            }
        }
    }

    const [subjectsData, count] = await prisma.$transaction([
        prisma.subject.findMany({
            where: where,
            include: {
                teachers: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.subject.count({
            where: where
        })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
                            <FormModal table="subject" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={subjectsData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default SubjectListPage
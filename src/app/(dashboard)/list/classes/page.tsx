import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { currentUserId, role } from "@/lib/util"
import { Class, Grade, Prisma, Teacher } from "@prisma/client"
import Image from "next/image"

type ClassList = Class & { supervisor: Teacher }

const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
]

const renderRow = (item: ClassList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.capacity}</td>
        <td className="hidden md:table-cell">{item.name[0]}</td>
        <td className="hidden md:table-cell">{`${item.supervisor.name} ${item.supervisor.surname}`}</td>
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
                        <FormModal table="class" type="update" data={item} id={item.id} />
                        <FormModal table="class" type="delete" id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
}

const ClassListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.ClassWhereInput = {}

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
            switch (key) {
                case "supervisorId":
                    where.supervisorId = value
                    break;
                case "search":
                    where.name = { contains: value, mode: "insensitive" }
                    break;
                default:
                    break;
            }
        }
    }

    switch (role) {
        case "teacher":
            where.lesson = { some: { teacherId: currentUserId } }
            break;

        default:
            break;
    }

    console.log(where)

    const [classesData, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: where,
            include: {
                supervisor: true
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.class.count({
            where: where
        })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
                            <FormModal table="class" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={classesData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default ClassListPage
import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { currentUserId, role } from "@/lib/util"
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type AssignmentList = Assignment & { lesson: { subject: Subject, class: Class, teacher: Teacher } }

const columns = [
    { header: "Subject", accessor: "subject" },
    { header: "Class", accessor: "class" },
    { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
    { header: "Due Date", accessor: "dueDate", className: "hidden lg:table-cell" },
    ...(role === "admin" || role === "teacher") ? [{ header: "Actions", accessor: "action" }] : [],
]
const renderRow = (item: AssignmentList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.lesson.subject.name}</h3>
            </div>
        </td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
        <td className="hidden md:table-cell">{item.dueDate.toLocaleDateString()}</td>
        <td>
            <div className="flex items-center gap-2">
                {/* <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src={"/edit.png"} alt="" width={16} height={16} />
                    </button>
                </Link> */}
                {(role === "admin" || role === "teacher") &&
                    // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
                    //     <Image src={"/delete.png"} alt="" width={16} height={16} />
                    // </button>
                    <>
                        <FormModal table="assignment" type="update" data={item} id={item.id} />
                        <FormModal table="assignment" type="delete" id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
}

const AssignmentListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.AssignmentWhereInput = {}

    where.lesson = {}

    // FILTRI DA URL
    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
            switch (key) {
                case "teacherId":
                    where.lesson.teacherId = value;
                    break;
                case "classId":
                    where.lesson.classId = parseInt(value)
                    break;
                case "search":
                    // where.lesson.subject = { name: { contains: value, mode: "insensitive" } };
                    where.OR = [
                        { lesson: { subject: { name: { contains: value, mode: "insensitive" } } } },
                        { lesson: { teacher: { name: { contains: value, mode: "insensitive" } } } },
                        { lesson: { teacher: { surname: { contains: value, mode: "insensitive" } } } },
                    ]
                    break;
                default:
                    break;
            }
        }
    }

    // FILTRI DI SESSIONE
    switch (role) {
        case "admin":
            break;
        case "teacher":
            where.lesson.teacherId = currentUserId;
            break;
        case "student":
            where.lesson.class = { students: { some: { id: currentUserId! }, } }
            break;
        case "parent":
            where.lesson.class = { students: { some: { parentId: currentUserId! }, } }
            break;
    }

    // console.log(where)

    const [assignmentsData, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: where,
            include: {
                lesson: {
                    include: {
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                        subject: { select: { name: true } }
                    }
                }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.assignment.count({
            where: where
        })
    ])
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSeach />
                    <div className="self-end flex items-center gap-4">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") &&
                            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            //     <Image src="/plus.png" alt="" width={14} height={14} />
                            // </button>
                            <FormModal table="assignment" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default AssignmentListPage
import FormModal from "@/components/FormModal"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSeach from "@/components/TableSeach"
import { resultsData, role } from "@/lib/data"
import prisma from "@/lib/prisma"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { Prisma, Result, Student } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type ResultList = {
    id: number
    title: string
    studentName: string
    studentSurname: string
    teacherName: string
    teacherSurname: string
    score: number
    className: string
    startTime: Date
}

const columns = [
    { header: "Title", accessor: "title" },
    { header: "Student", accessor: "student" },
    { header: "Score", accessor: "score", className: "hidden md:table-cell" },
    { header: "Teacher", accessor: "teacher", className: "hidden lg:table-cell" },
    { header: "Class", accessor: "class", className: "hidden lg:table-cell" },
    { header: "Date", accessor: "date", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
]

const renderRow = (item: ResultList) => {
    return <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.title}</h3>
            </div>
        </td>
        <td>{item.studentName + " " + item.studentSurname}</td>
        <td className="hidden md:table-cell">{item.score}</td>
        <td className="hidden md:table-cell">{item.teacherName + " " + item.teacherSurname}</td>
        <td className="hidden md:table-cell">{item.className}</td>
        <td className="hidden md:table-cell">{item.startTime.toLocaleDateString()}</td>
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
                        <FormModal table="result" type="update" data={item} id={item.id} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                }
            </div>
        </td>
    </tr>
}

const ResultListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {

    const { page, ...queryParams } = searchParams

    const p = page ? parseInt(page) : 1

    const where: Prisma.ResultWhereInput = {}

    for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined) {
            switch (key) {

                case "studentId":
                    where.studentId = value
                    // where.OR = [
                    //     { exam: { lesson: { name: { contains: value, mode: "insensitive" } } } },
                    //     { assignment: { lesson: { name: { contains: value, mode: "insensitive" } } } },
                    // ]
                    break;
                case "search":
                    where.OR = [
                        { exam: { title: { contains: value, mode: "insensitive" } } },
                        { student: { name: { contains: value, mode: "insensitive" } } },
                        { student: { surname: { contains: value, mode: "insensitive" } } },
                    ]
                    break;
                default:
                    break;
            }
        }
    }

    const [resultsDataResponse, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: where,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            include: {
                                teacher: { select: { name: true, surname: true } },
                                class: { select: { name: true } },
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            include: {
                                teacher: { select: { name: true, surname: true } },
                                class: { select: { name: true } },
                            }
                        }
                    }
                }
            },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1)
        }),
        prisma.result.count({
            where: where
        })
    ])

    const resultsData = resultsDataResponse.map(i => {
        const assessment = i.exam || i.assignment
        if (!assessment) return null;
        const isExam = "startTime" in assessment
        return {
            id: i.id,
            title: assessment.title,
            studentName: i.student?.name,
            studentSurname: i.student?.surname,
            teacherName: assessment.lesson?.teacher?.name,
            teacherSurname: assessment.lesson?.teacher?.surname,
            score: i.score,
            className: assessment.lesson?.class?.name,
            startTime: isExam ? assessment.startTime : assessment.dueDate
        }
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
                            <FormModal table="result" type="create" />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={resultsData} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default ResultListPage
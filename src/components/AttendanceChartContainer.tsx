import Image from "next/image"
import AttendanceChart from "./AttendanceChart"
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const lastMonday = new Date(today);
    lastMonday.setDate(lastMonday.getDate() - daysSinceMonday)

    const resData = await prisma.attendance.findMany({
        where: { date: { gte: lastMonday } },
        select: { present: true, date: true }
    })

    // console.log(resData)

    const daysTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    const attendanceMap: { [key: string]: { present: number, absent: number } } = {
        "Mon": { present: 0, absent: 0 },
        "Tue": { present: 0, absent: 0 },
        "Wed": { present: 0, absent: 0 },
        "Thu": { present: 0, absent: 0 },
        "Fri": { present: 0, absent: 0 },
    }

    resData.forEach(d => {
        const day = d.date.getDay()
        if (day >= 1 && day <= 5) {
            if (d.present)
                attendanceMap[daysTheWeek[day - 1]].present++;
            else
                attendanceMap[daysTheWeek[day - 1]].absent++;
        }
    })

    const data = daysTheWeek.map(day => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent
    }))

    // console.log(attendanceMap)

    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <AttendanceChart data={data} />
        </div>

    )
}

export default AttendanceChartContainer
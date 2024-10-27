import prisma from "@/lib/prisma"
import BigCalendar from "./BigCalendar"
import { adjustScheduleToCurrentWeek } from "@/lib/util"

const BigCalendarContainer = async ({ type, id }: { type: "teacherId" | "classId", id: string | number }) => {
    console.log(id)
    const dataRes = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId" ? { teacher: { username: id as string } } : { classId: id as number })
        }
    })

    const data = dataRes.map(lesson => ({
        title: lesson.name,
        dayOfWeek: lesson.day,
        start: lesson.startTime,
        end: lesson.endTime
    }))

    console.log(data)

    const adjustedScheduleToCurrentWeek = adjustScheduleToCurrentWeek(data)

    // console.log(adjustedScheduleToCurrentWeek)

    return (
        <div className=""><BigCalendar data={adjustedScheduleToCurrentWeek} /></div>
    )
}

export default BigCalendarContainer
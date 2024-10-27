import { auth } from "@clerk/nextjs/server"
import { $Enums } from "@prisma/client";

const { sessionClaims, userId } = auth()
export const role = (sessionClaims?.metadata as { role: string })?.role
export const currentUserId = userId;

const currentWorkWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const startOfWeek = new Date(today)
    if (dayOfWeek === 0) {
        startOfWeek.setDate(today.getDate() + 1)
    }
    else if (dayOfWeek === 6) {
        startOfWeek.setDate(today.getDate() + 2);
    }
    else {
        startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek - 1))
    }
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 4)
    endOfWeek.setHours(23, 59, 59, 999)

    return { startOfWeek, endOfWeek }
}

export const adjustScheduleToCurrentWeek = (lessons: { title: string, start: Date, end: Date, dayOfWeek: $Enums.Day }[]) => {

    const { startOfWeek, endOfWeek } = currentWorkWeek()
    return lessons.map(lesson => {
        const dayMap = {
            "MONDAY": 0,
            "TUESDAY": 1,
            "WENSDAY": 2,
            "THURSDAY": 3,
            "FRIDAY": 4
        }
        const lessonDayOfWeek = dayMap[lesson.dayOfWeek];

        const adjustedStartDate = new Date(startOfWeek)
        adjustedStartDate.setDate(adjustedStartDate.getDate() + lessonDayOfWeek)
        adjustedStartDate.setHours(
            lesson.start.getHours(),
            lesson.start.getMinutes(),
            lesson.start.getSeconds()
        )
        const adjustedEndDate = new Date(adjustedStartDate);
        adjustedEndDate.setHours(
            lesson.end.getHours(),
            lesson.end.getMinutes(),
            lesson.end.getSeconds()
        )

        return {
            title: lesson.title,
            start: adjustedStartDate,
            end: adjustedEndDate
        }
    })
}
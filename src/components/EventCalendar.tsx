"use client"

import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [{
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem mollit laboris dolore nulla enim veniam fugiat labore culpa."
}, {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem mollit laboris dolore nulla enim veniam fugiat labore culpa."
}, {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem mollit laboris dolore nulla enim veniam fugiat labore culpa."
},]

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());
    const router = useRouter()
    useEffect(() => {
        if (value instanceof Date) {
            router.push(`?date=${value}`)
        }
    },
        [value, router])
    return (
        <Calendar onChange={onChange} value={value} />

    )
}

export default EventCalendar
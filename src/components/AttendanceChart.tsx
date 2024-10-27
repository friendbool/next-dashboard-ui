"use client"

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// const data = [
//     {
//         name: 'Mon',
//         present: 40,
//         absent: 24,
//     },
//     {
//         name: 'Tue',
//         present: 30,
//         absent: 13,
//     },
//     {
//         name: 'Wen',
//         present: 20,
//         absent: 98,
//     },
//     {
//         name: 'Thu',
//         present: 27,
//         absent: 39,
//     },
//     {
//         name: 'Fri',
//         present: 18,
//         absent: 48,
//     },
// ];

const AttendanceChart = ({ data }: { data: { name: string, present: number, absent: number }[] }) => {
    return (

        <ResponsiveContainer width="100%" height="90%">
            <BarChart
                width={500}
                height={300}
                data={data}
                barSize={20}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} color='#ddd' />
                <XAxis dataKey="name"
                    axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                <YAxis
                    axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
                <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
                <Bar
                    legendType='circle'
                    dataKey="present"
                    fill="#FAE27C"
                    radius={[10, 10, 0, 0]}
                />
                <Bar
                    legendType='circle'
                    dataKey="absent"
                    fill="#C3EBFA"
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default AttendanceChart
import { ReactNode } from "react"


const Table = ({
    columns,
    renderRow,
    data
}: {
    columns: { header: string, accessor: string, className?: string }[]
    renderRow: (item: any) => ReactNode,
    data: any[]
}) => {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-500 text-sm">
                    {columns.map(c => (<th key={c.accessor} className={c.className}>{c.header}</th>))}
                </tr>
            </thead>
            <tbody>
                {data?.map(renderRow)}
            </tbody>
        </table >
    )
}

export default Table
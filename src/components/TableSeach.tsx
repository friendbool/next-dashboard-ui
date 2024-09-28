"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

const TableSeach = () => {
    const router = useRouter()
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params = new URLSearchParams(window.location.search)
        params.set("search", (e.currentTarget.elements[0] as HTMLInputElement).value)
        params.delete("page")
        router.push(location.pathname + "?" + params.toString())
    }
    return (
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex items-center gap-2 text-xs ring-[1.5px] ring-gray-300 px-2 rounded-full">
            <Image src="/search.png" alt="" width={14} height={14} />
            <input type="text" placeholder="Search..." className="w-[200px] p-2 outline-none bg-transparent" />
        </form>
    )
}

export default TableSeach
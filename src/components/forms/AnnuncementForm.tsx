"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required!" }),
    class: z.string().min(1, { message: "Class is required!" }),
    date: z.date({ message: "Date is required!" }),
});

type Inputs = z.infer<typeof schema>

const EventForm = ({ type, data }: {
    type: "create" | "update"
    data?: any
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new event" : `Update event`}</h1>
            <span className="text-xs text-gray-400 font-medium">Event Information</span>
            <div className="flex flex-wrap items-center gap-4">
                <InputField label="Title" error={errors?.title} name="title" defaultValue={data?.title} register={register} />
                <InputField label="Class" error={errors?.class} name="class" defaultValue={data?.class} register={register} />
                <InputField label="Date" error={errors?.date} name="date" type="date" defaultValue={data?.date} register={register} />
                </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default EventForm
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    capacity: z.number().min(1, { message: "Capacity is required!" }),
    grade: z.number().min(1, { message: "Grade is required!" }),
    supervisor: z.string().min(1, { message: "Supervisor is required!" }),
});

type Inputs = z.infer<typeof schema>

const ClassForm = ({ type, data }: {
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : `Update class ${data.name}`}</h1>
            <span className="text-xs text-gray-400 font-medium">Class Information</span>
            <div className="flex flex-wrap items-center gap-4">
                <InputField label="Name" error={errors?.name} name="name" defaultValue={data?.name} register={register} />
                <InputField label="Capacity" error={errors?.capacity} name="capacity" type="number" defaultValue={data?.capacity} register={register} />
                <InputField label="Grade" error={errors?.grade} name="grade" type="number" defaultValue={data?.grade} register={register} />
                <InputField label="Supervisor" error={errors?.supervisor} name="supervisor" type="text" defaultValue={data?.supervisor} register={register} />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default ClassForm
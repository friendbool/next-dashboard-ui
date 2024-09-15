"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    name: z.string().min(1, { message: "Subject Name is required!" }),
    teachers: z.string().min(1, { message: "Teachers are required!" }),
});

type Inputs = z.infer<typeof schema>

const ParentForm = ({ type, data }: {
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new subject" : `Update subject ${data.name}`}</h1>
            <span className="text-xs text-gray-400 font-medium">Subject Information</span>
            <div className="flex flex-wrap items-center gap-4">
                <InputField label="Subject name" error={errors?.name} name="name" defaultValue={data?.name} register={register} />
                <InputField label="Teachers" error={errors?.teachers} name="teachers" type="teachers" defaultValue={data?.teachers} register={register} />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default ParentForm
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    username: z.string()
        .min(3, { message: 'Username must be at lest 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' })
    ,
    email: z.string().email({ message: "Invalid email address!" }),
    password: z.string().min(8, { message: "Password must be at lest 8 characters long!" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    phone: z.string().min(1, { message: "Phone number is required!" }),
    address: z.string().min(1, { message: "Address is required!" }),
    bloodType: z.string().min(1, { message: "Blood type is required!" }),
    birthday: z.date({ message: "Birthday is required!" }),
    sex: z.enum(["male", "female"], { message: "Sex is required!" }),
    image: z.instanceof(File, { message: "Image is required!" }),
    students: z.string().min(1, {message: "Students are required!"})
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new parent" : `Update parent ${data.firstName} ${data.lastName}`}</h1>
            <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <InputField label="Username" error={errors?.username} name="username" defaultValue={data?.username} register={register} />
                <InputField label="Email" error={errors?.email} name="email" type="email" defaultValue={data?.email} register={register} />
                <InputField label="Password" error={errors?.password} name="password" type="password" defaultValue={data?.password} register={register} />
            </div>
            <span className="text-xs text-gray-400 font-medium">Personal Information</span>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <InputField label="First Name" error={errors?.firstName} name="firstName" defaultValue={data?.firstName} register={register} />
                <InputField label="lastName" error={errors?.lastName} name="lastName" defaultValue={data?.lastName} register={register} />
                <InputField label="Phone" error={errors?.phone} name="phone" defaultValue={data?.phone} register={register} />
                <InputField label="Address" error={errors?.address} name="address" defaultValue={data?.address} register={register} />
                <InputField label="Blood Type" error={errors?.bloodType} name="bloodType" defaultValue={data?.bloodType} register={register} />
                <InputField label="Birthday" error={errors?.birthday} name="birthday" type="date" defaultValue={data?.birthday} register={register} />
                <InputField label="Students" error={errors?.students} name="students" type="date" defaultValue={data?.students} register={register} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        {...register("sex")}
                        defaultValue={data?.sex}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value=""></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && <p className="text-xs text-red-400">{errors.sex?.message.toString()}</p>}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
                    <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
                        <Image src="/upload.png" alt="" width={28} height={28} />
                        <span>Upload a photo</span>
                    </label>
                    <input type="file" {...register("image")} className="hidden" id="img" />
                    {errors.image?.message && <p className="text-xs text-red-400">{errors.image?.message.toString()}</p>}
                </div>
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default ParentForm
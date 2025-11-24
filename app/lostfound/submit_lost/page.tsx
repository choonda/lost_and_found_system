/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import InputField from "@/app/component/Form/InputField";
import { FormSchema } from "@/lib/validation/InputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { RiFolderUploadLine } from "react-icons/ri";

const LostPage = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Submission Success:", data);
    alert("Form submitted! Check console for data.");
  };

  const watchPhoto = watch("photo");
  useEffect(() => {
    if (watchPhoto && watchPhoto[0]) {
      const file = watchPhoto[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [watchPhoto]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen min-w-screen bg-lightgreen px-8 py-4 flex flex-col items-center gap-4">
        <div className="flex flex-row p-4 w-full items-center gap-4">
          <Link href="/lostfound">
            <AiOutlineArrowLeft className="text-[#969DA3] w-8 h-8 font-semibold cursor-pointer" />
          </Link>
          <h1 className="text-2xl text-[#969DA3]">FIND</h1>
        </div>
        <div className="border-2  border-dashed border-[#B8B8B8] p-4 w-full h-fit rounded-md gap-2 flex flex-col">
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="FIELD 1: Item Name"
              placeholder="item name"
              {...register("itemName")}
              error={errors.itemName?.message}
            />
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="FIELD 2: Location"
              placeholder="location"
              {...register("location")}
              error={errors.location?.message}
            />
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="FIELD 3: Date (In year-month-day eg.2025-01-01)"
              placeholder="date"
              {...register("date")}
              error={errors.date?.message}
            />
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="FIELD 4 Description"
              placeholder="description"
              {...register("description")}
            />
          </div>
        </div>
        <div className="bg-white p-4 items-center rounded-xl">
          <label
            className={`flex flex-col  items-center justify-center px-25 relative ${
              photoPreview
                ? ""
                : "border-2 border-dashed border-[#969DA3] cursor-pointer "
            }`}
            htmlFor="photo-upload"
          >
            {photoPreview && (
              <div className="mt-4">
                <Image
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-md border"
                  width={40}
                  height={40}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 left-2 bg-lightgreen text-[#969DA3] rounded-full w-fit h-fit p-2 flex items-center justify-center shadow-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
            {!photoPreview && (
              <div className="items-center flex flex-col">
                <RiFolderUploadLine className="text-[#969DA3] w-30 h-30 " />
                <input
                  type="file"
                  accept="image/*"
                  className="outline-none hidden"
                  id="photo-upload"
                  {...register("photo")}
                />
                <p className="text-[#969DA3] text-2xl font-light">
                  Upload a photo
                </p>
              </div>
            )}
          </label>
        </div>
        <div className="w-fit h-fit px-8 py-4 bg-buttongreen rounded-full cursor-pointer hover:bg-[#006557]">
          <button className="" type="submit">
            <p className="text-white text-md">Submit</p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LostPage;

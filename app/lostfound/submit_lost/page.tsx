"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { RiFolderUploadLine } from "react-icons/ri";

import { ItemCreateFormSchema } from "@/lib/validation/InputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import InputField from "@/app/component/Form/InputField";

const LostPage = () => {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  type FormValues = z.infer<typeof ItemCreateFormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ItemCreateFormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Submission Success:", data.name);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location ?? "");
    formData.append("description", data.description ?? "");
    formData.append("date", data.date ? data.date.toISOString() : "");
    formData.append("type", "Lost");
    formData.append("centerId", "1");
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    console.log("Submission Success:", formData);

    const response = await fetch("/api/items", {
      method: "POST",
      body: formData,
    });

    if (response?.status !== 200) {
      alert("Failed to submit the form. Please try again.");
      return;
    }

    alert("Form submitted successfully!");

    router.push("/home");
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
              label="Item Name"
              placeholder="item name"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="Location"
              placeholder="location"
              {...register("location")}
              error={errors.location?.message}
            />
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <div>
              <label className="text-md font-bold text-[#969DA3]">Date</label>
            </div>
            <div className="w-full  bg-[#E6F6F4] rounded-md flex">
              <input
                className={`w-full flex flex-row placeholder-[#808080] items-center gap-5 h-fit px-4 py-2 focus:ring-[#b0e4dd] focus:ring-2 focus:outline-none transition-all duration-200 `}
                type="date"
                {...register("date")}
              />
            </div>
            {errors.date && (
              <p className="ml-2 text-red-500 text-sm">
                {errors.date?.message}
              </p>
            )}
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="Description"
              placeholder="description"
              {...register("description")}
            />
          </div>
        </div>
        <div className="bg-white p-4 items-center rounded-xl">
          <label
            className={`flex flex-col  items-center justify-center relative ${
              photoPreview
                ? ""
                : "border-2 border-dashed border-[#969DA3] cursor-pointer "
            }`}
            htmlFor="photo-upload"
          >
            {photoPreview && (
              <div className="relative">
                <Image
                  src={photoPreview}
                  alt="preview"
                  className="w-fit h-64 object-cover rounded-md border"
                  width={40}
                  height={40}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 left-2 bg-lightgreen text-[#969DA3] rounded-full w-fit h-fit p-1 flex items-center justify-center shadow-lg cursor-pointer text-sm"
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
                {errors.photo && (
                  <p className="ml-2 text-red-500 text-sm">
                    {errors.photo?.message as string}
                  </p>
                )}
              </div>
            )}
          </label>
        </div>
        <div className="w-fit h-fit px-8 py-4 bg-buttongreen rounded-full cursor-pointer hover:bg-[#006557]">
          <button className="cursor-pointer" type="submit">
            <p className="text-white text-md">Submit</p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LostPage;

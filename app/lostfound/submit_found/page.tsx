"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, Resolver } from "react-hook-form";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { RiFolderUploadLine } from "react-icons/ri";

import { ItemCreateFormSchema } from "@/lib/validation/InputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import InputField from "@/app/component/Form/InputField";
import FindSimilarModal from "@/app/component/FindSimilarModal";

const FoundPage = () => {
  type FormValues = z.infer<typeof ItemCreateFormSchema>;

  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sensitiveError, setSensitiveError] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(
      ItemCreateFormSchema
    ) as unknown as Resolver<FormValues>,
  });

  const watchPhoto = watch("photo");

  // 1️⃣ Watch for photo upload and call similarity API
  useEffect(() => {
    const file = watchPhoto?.[0];
    if (!file) {
      setPhotoPreview(null);
      setSimilarItems([]);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString();
      if (!base64) return;

      setPhotoPreview(base64);
      setIsCheckingImage(true);
      try {
        const res = await fetch("/api/ai/similarity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base64),
        });

        if (res.ok) {
          const data = await res.json();
          const items = data.similarItems || [];
          setSimilarItems(items);
          // If AI returned a description, populate the description field
          if (data.aiDescription) {
            setValue("description", data.aiDescription);
          }
          // If similar items found, open the modal to show them
          if (items.length > 0) {
            setIsOpenModal(true);
          }
        } else {
          console.error("Image similarity API error");
        }
      } catch (err) {
        console.error("Failed to fetch similar items", err);
      } finally {
        setIsCheckingImage(false);
      }
    };

    reader.readAsDataURL(file);
  }, [watchPhoto]);

  // 2️⃣ Form submit handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSensitiveError(null);

    // Check sensitive content using AI
    try {
      const res = await fetch("/api/ai/sensitive-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: `${data.name} ${data.location}` }),
      });
      const result = await res.json();

      if (result.isSensitive) {
        setSensitiveError(
          "Submission blocked: Name or Location contains sensitive content"
        );
        // clear fields so user must re-enter
        reset(
          { name: "", location: "", date: "", description: "" },
          { keepErrors: false, keepDirty: false }
        );
        setPhotoPreview(null);
        setSimilarItems([]);
        return;
      }
    } catch (err) {
      console.error("Sensitive content check failed", err);
      alert("Failed to verify sensitive content. Try again.");
      return;
    }

    // Check similar items — if found, show modal and stash data so user can continue
    if (similarItems.length > 0) {
      setPendingData(data);
      setIsOpenModal(true);
      return;
    }

    // If no similar items, proceed with submission immediately
    await submitFormData(data);
  };

  // helper to actually submit the FormValues to the API
  const submitFormData = async (data: FormValues | null) => {
    if (!data) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location ?? "");
    formData.append("date", data.date ? data.date.toISOString() : "");
    formData.append("type", "Found");
    formData.append("centerId", "1");
    formData.append("description", data.description ?? "");
    if (data.photo && data.photo[0]) formData.append("photo", data.photo[0]);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        alert("Failed to submit the form. Please try again.");
        return;
      }

      alert("Form submitted successfully!");
      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen min-w-screen bg-lightgreen px-8 py-4 flex flex-col items-center gap-4">
        {/* Header */}
        <div className="flex flex-row p-4 w-full items-center gap-4">
          <Link href="/lostfound">
            <AiOutlineArrowLeft className="text-[#969DA3] w-8 h-8 font-semibold cursor-pointer" />
          </Link>
          <h1 className="text-2xl text-[#969DA3]">FOUND</h1>
        </div>

        {/* Form Fields */}
        <div className="border-2 border-dashed border-[#B8B8B8] p-4 w-full h-fit rounded-md gap-2 flex flex-col">
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
            <label className="text-md font-bold text-[#969DA3]">Date</label>
            <input
              className="w-full flex px-4 py-2 rounded-md bg-[#E6F6F4] focus:outline-none focus:ring-2 focus:ring-[#b0e4dd]"
              type="date"
              {...register("date")}
            />
            {errors.date && (
              <p className="ml-2 text-red-500 text-sm">
                {errors.date?.message}
              </p>
            )}
          </div>
          <div className="bg-white w-full h-fit p-4 rounded-md gap-4">
            <InputField
              label="Description"
              placeholder="Auto-generated description or enter your own"
              {...register("description")}
              error={errors.description?.message as string}
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white p-4 items-center rounded-xl w-full max-w-md">
          <label
            className={`flex flex-col items-center justify-center relative ${
              photoPreview
                ? ""
                : "border-2 border-dashed border-[#969DA3] cursor-pointer"
            }`}
            htmlFor="photo-upload"
          >
            {photoPreview && (
              <div className="relative">
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
                    e.stopPropagation();
                    setPhotoPreview(null);
                    setSimilarItems([]);
                  }}
                  className="absolute top-2 left-2 bg-lightgreen text-[#969DA3] rounded-full p-1 shadow-lg"
                >
                  Cancel
                </button>
              </div>
            )}
            {!photoPreview && (
              <div className="items-center flex flex-col">
                <RiFolderUploadLine className="text-[#969DA3] w-30 h-30" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  {...register("photo")}
                />
                <p className="text-[#969DA3] text-2xl font-light">
                  Upload a photo
                </p>
              </div>
            )}
          </label>

          {(isCheckingImage || isSubmitting) && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
              <div className="bg-white bg-opacity-95 rounded-md p-4 shadow-lg">
                <p className="text-gray-700 text-center">
                  {isSubmitting
                    ? "Loading..."
                    : "AI is finding similar items..."}
                </p>
              </div>
            </div>
          )}

          {similarItems.length > 0 && (
            <div className="p-2 bg-yellow-100 rounded mt-2">
              <h3 className="font-semibold text-sm">Similar items found:</h3>
              <ul className="text-sm">
                {similarItems.map((item: any) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sensitive content error */}
        {sensitiveError && (
          <p className="text-red-600 mt-2">{sensitiveError}</p>
        )}

        {/* Submit Button */}
        <div className="w-fit h-fit px-8 py-4 bg-buttongreen rounded-full cursor-pointer hover:bg-[#006557]">
          <button type="submit" className="text-white text-md cursor-pointer">
            Submit
          </button>
        </div>
      </div>
      {isOpenModal && (
        <FindSimilarModal
          isOpen={isOpenModal}
          items={similarItems}
          onClose={async () => {
            // user chose to continue anyway
            setIsOpenModal(false);
            await submitFormData(pendingData);
            setPendingData(null);
          }}
          onCancel={() => {
            // user chose to cancel/close modal and continue editing
            setIsOpenModal(false);
            setPendingData(null);
          }}
        />
      )}
    </form>
  );
};

export default FoundPage;

import z from "zod";

export const FormSchema = z.object({
  itemName: z.string().min(1, { message: "Item name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  description: z.string().optional(),
  photo: z.any().refine((file) => file instanceof File, "Photo is required"),
});

export type InputSchema = z.infer<typeof FormSchema>;

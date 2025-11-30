import z from "zod";

export const ItemCreateFormSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  description: z.string().optional(),
  photo: z.custom<FileList>().refine((files) => files && files.length > 0, {
    message: "Photo is required",
  }),
});

export type InputSchema = z.infer<typeof ItemCreateFormSchema>;

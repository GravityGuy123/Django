"use client";
import { axiosInstance } from "@/lib/axios.config";
import { Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const registerProductSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    stock: z.number().min(1, "Stock must be at least 1"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long"),
    current_price: z.number().min(1, "Price must be at least 1"),
    thumbnail: z.any(),
  })
  .superRefine((data, ctx) => {
    const files = data.thumbnail as FileList;
    if (!files || files.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["thumbnail"],
        message: `THUMBNAIL is required`,
      });
    }
    const file = files[0];

    if (file.size > MAX_THUMBNAIL_SIZE) {
      ctx.addIssue({
        code: "custom",
        path: ["THUMBNAIL"],
        message: `THUMBNAIL size must be less than ${
          MAX_THUMBNAIL_SIZE / 1024 / 1024
        } MB`,
      });
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: "custom",
        path: ["THUMBNAIL"],
        message: "Invalid image type",
      });
    }
  });

type RegisterProductSchema = z.infer<typeof registerProductSchema>;

// from component here
export const RegisterProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProductSchema>({
    resolver: zodResolver(registerProductSchema),
  });

  const onSubmit = async (data: RegisterProductSchema) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("stock", data.stock.toString());
      formData.append("description", data.description);
      formData.append("current_price", data.current_price.toString());
      formData.append("thumbnail", data.thumbnail);

      const response = await axiosInstance.post<Product>(
        "api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="file"
        accept="images/*"
        required
        {...register("thumbnail")}
      />
      {errors.thumbnail && (
        <p className="text-red-600">{errors.thumbnail.message as string}</p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

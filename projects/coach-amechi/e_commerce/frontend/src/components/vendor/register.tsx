"use client";

import { axiosInstance } from "@/lib/axios.config";
import { RegisterVendorSchema, registerVendorShema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export function RegisterVendorForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterVendorSchema>({
    resolver: zodResolver(registerVendorShema),
  });

  async function handleVendorRegistration(data: RegisterVendorSchema) {
    try {
      await axiosInstance.post("api/vendors", data, {
        headers: {
          "Content-Type": "mulipart/formdata",
        },
      });
      toast.success("Vendor registration successful");
      setTimeout(() => {
        router.push("/vendor");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleVendorRegistration)}>
      <Input
        type="email"
        required
        {...register("brand_email")}
        disabled={isSubmitting}
      />
      {errors.brand_email && (
        <p className="text-red-600">{errors.brand_email.message}</p>
      )}
      <hr />
      <Input type="text" required {...register("brand_name")} />
      {errors.brand_name && (
        <p className="text-red-600">{errors.brand_name.message}</p>
      )}
      <hr />
      <Input type="file" accept="images/*" {...register("avatar")} />
      {errors.avatar && (
        <p className="text-red-600">{errors.avatar.message as string}</p>
      )}
      <hr />
      <hr />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : "Register"}
      </Button>
    </form>
  );
}

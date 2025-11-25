"use client";
import { axiosInstance, handleApiError } from "@/lib/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { RegisterSchema, registerFormSchema } from "@/lib/schema";
import { Spinner } from "../ui/spinner";
import { useState } from "react";

// component
export function RegisterForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerFormSchema) });

  const router = useRouter();

  async function onSubmit(data: RegisterSchema) {
    try {
      // build form data
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);

      // send request
      await axiosInstance.post("api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful! login", {
        position: "top-right",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 2_000);
    } catch (error) {
      const errorMesssage = handleApiError(error, "Registration failed");
      toast.error(errorMesssage, { position: "top-center" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      <label className="block mb-2">
        <span className="block text-sm">Email</span>
        <Input
          type="email"
          disabled={isSubmitting}
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </label>

      <label className="block mb-2">
        <span className="block text-sm">Password</span>
        <Input
          type="password"
          autoComplete="on"
          disabled={isSubmitting}
          {...register("password")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </label>

      <label className="block mb-2">
        <span className="block text-sm">Confirm Password</span>
        <Input
          type="password"
          autoComplete="on"
          disabled={isSubmitting}
          {...register("confirm_password")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.confirm_password && (
          <p className="text-sm text-red-600 mt-1">
            {errors.confirm_password.message}
          </p>
        )}
      </label>

      <label className="block mb-4">
        <span className="block text-sm">Avatar (JPG/PNG/WEBP, max 2MB)</span>
        <Input
          type="file"
          accept="image/*"
          {...register("avatar", {
            onChange: (e) => {
              handleFileChange(e);
            },
          })}
        />
        {errors.avatar && (
          <p className="text-sm text-red-600 mt-1">
            {errors.avatar.message as string}
          </p>
        )}
      </label>

      {preview && (
        <div className="mb-4">
          <span className="block text-sm">Preview</span>
          <Image
            src={preview}
            alt="avatar preview"
            height={400}
            width={400}
            className="w-24 h-24 object-cover rounded"
          />
        </div>
      )}

      {/* login */}
      <div className="block mb-2">
        <Link href={"/auth/login"}>Login</Link>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        {isSubmitting ? <Spinner /> : "Register"}
      </Button>
    </form>
  );
}

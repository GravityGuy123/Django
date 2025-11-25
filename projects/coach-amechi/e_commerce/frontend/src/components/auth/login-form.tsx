"use client";

import { baseUrl, handleApiError } from "@/lib/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

type LoginSchema = z.infer<typeof loginSchema>;

interface LoginUserResponse {
  readonly access: string;
  readonly refresh: string;
}

// Component

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await fetch(`${baseUrl}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const responseData: LoginUserResponse = await response.json();
      localStorage.setItem("access", responseData.access);
      localStorage.setItem("refresh", responseData.refresh);
      toast.success("Login successful", { position: "top-right" });

      setTimeout(() => {
        router.push("/");
      }, 1_500);
    } catch (err) {
      const errorMesssage = handleApiError(err, "Login failed");
      toast.error(errorMesssage, { position: "top-center" });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <label className="block mb-2">
          <span className="block text-sm">Email</span>
          <Input
            type="email"
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
            {...register("password")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </label>
        {/* sign up */}
        <div className="block mb-2">
          <Link href={"/auth/register"}>Register</Link>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          {isSubmitting ? <Spinner /> : "Login"}
        </Button>
      </form>
    </>
  );
}

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthFormProps {
  variant: "login" | "register";
}

export function AuthForm({ variant }: AuthFormProps) {
  const child = () => {
    switch (variant) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-4 bg-white rounded shadow-md">
        {child()}
      </div>
    </div>
  );
}

// z.object({
//   email: z.email("Invalid email address"),

//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[0-9]/, "Password must contain at least one number")
//     .regex(
//       /[^a-zA-Z0-9]/,
//       "Password must contain at least one special character"
//     ),

//   confirm_password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long"),

//   avatar: z.any().optional(),
// })
//   .refine((data) => data.password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
//   })
//   .superRefine((data, ctx) => {
//     const files = data.avatar as FileList | undefined;
//     if (files && files.length > 0 && files instanceof FileList) {
//       const file = files[0];

//       if (file.size > MAX_AVATAR_SIZE) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["avatar"],
//           message: `Avatar size must be less than ${
//             MAX_AVATAR_SIZE / 1024 / 1024
//           } MB`,
//         });
//       }
//       if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["avatar"],
//           message: "Invalid image type",
//         });
//       }
//     }
//   });

import z from "zod";

const MAX_AVATAR_SIZE = 1 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const registerFormSchema = z
  .object({
    email: z.email().min(3),
    password: z
      .string()
      .min(8, "Password must at least be 8 characters")
      .regex(/[A-Z]/, "must contain uppercase")
      .regex(/[a-z]/, "lower cas")
      .regex(/[0-9]/, "must have numbers")
      .regex(/[^A-Za-z0-9]/, "special carac"),

    confirm_password: z.string(),
    avatar: z.any().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password Mismatch",
    path: ["confirm_password"],
  })
  .superRefine((data, ctx) => {
    const files = data.avatar as FileList | undefined;
    if (files && files.length > 0 && files instanceof FileList) {
      const file = files[0];

      if (file.size > MAX_AVATAR_SIZE) {
        ctx.addIssue({
          code: "custom",
          path: ["avatar"],
          message: `Avatar size must be less than ${
            MAX_AVATAR_SIZE / 1024 / 1024
          } MB`,
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          path: ["avatar"],
          message: "Invalid image type",
        });
      }
    }
  });

export type RegisterSchema = z.infer<typeof registerFormSchema>;

export const registerVendorShema = z.object({
  brand_email: z.email().min(3),
  brand_name: z.string().min(3),
  avatar: z.any().optional(),
});

export type RegisterVendorSchema = z.infer<typeof registerVendorShema>;

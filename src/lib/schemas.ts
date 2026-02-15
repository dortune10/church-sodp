import { z } from "zod";

export const contactSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export const prayerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    request: z.string().min(10, "Request must be at least 10 characters"),
    sharePublicly: z.literal("on").optional(),
});

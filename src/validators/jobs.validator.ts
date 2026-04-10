import z from "zod";

export const createJobValidator = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  skillsRequired: z.array(z.string()).default([]),
  experienceRequired: z.string().min(1, "Experience required is required"),
  company: z.string().min(2, "Company name must be at least 2 characters").optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .optional(),
  salary: z.string().optional(),
  jobType: z.enum(["remote", "onsite", "hybrid"]),
});

export const updateJobValidator = createJobValidator.partial();

export const jobIdParamValidator = z.object({
  jobId: z.string().trim().min(1, "Job id is required"),
});

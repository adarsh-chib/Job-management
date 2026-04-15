import z from "zod";

export const createJobValidator = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  description: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  skillsRequired: z.array(z.string()).default([]),
  experienceMin: z
    .number()
    .int()
    .min(0, "Minimum experience must be 0 or more")
    .optional(),
  experienceMax: z
    .number()
    .int()
    .min(0, "Maximum experience must be 0 or more")
    .optional(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .optional(),
  salaryMin: z
    .number()
    .int()
    .min(0, "Minimum salary must be 0 or more")
    .optional(),
  salaryMax: z
    .number()
    .int()
    .min(0, "Maximum salary must be 0 or more")
    .optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .optional(),
  jobType: z.enum(["remote", "onsite", "hybrid"]).optional(),
});

export const updateJobValidator = createJobValidator.partial();

export const jobIdParamValidator = z.object({
  jobId: z.string().trim().min(1, "Job id is required"),
});

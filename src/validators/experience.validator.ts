import { z } from "zod";

export const createExperienceValidator = z.array(
  z
    .object({
      companyName: z.string().trim().min(2, "Company name is required"),
      jobTitle: z.string().trim().min(2, "Job title is required"),
      employmentType: z.string().trim().optional(),
      location: z.string().trim().optional(),
      locationType: z.string().trim().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      isCurrent: z.coerce.boolean().optional(),
      description: z.string().trim().optional(),
      skills: z.array(z.string().trim()).default([]),
    })
    .refine((data) => !data.endDate || data.endDate >= data.startDate, {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }),
);

export const updateExperienceValidator = z
  .object({
    companyName: z.string().trim().min(2, "Company name is required").optional(),
    jobTitle: z.string().trim().min(2, "Job title is required").optional(),
    employmentType: z.string().trim().optional(),
    location: z.string().trim().optional(),
    locationType: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    isCurrent: z.coerce.boolean().optional(),
    description: z.string().trim().optional(),
    skills: z.array(z.string().trim()).optional(),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  );

export const experienceIdParamValidator = z.object({
  experienceId: z.string().trim().min(1, "Experience id is required"),
});

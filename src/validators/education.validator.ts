import z from "zod";

const educationSchema = z
  .object({
    institutionName: z.string().trim().min(2, "Institution name is required"),
    qualification: z.string().trim().min(2, "Qualification is required"),
    fieldOfStudy: z.string().trim().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    grade: z.string().trim().optional(),
    description: z.string().trim().optional(),
  });

export const createEducationValidator = z.array(educationSchema);

export const updateEducationValidator = z
  .object({
    institutionName: z
      .string()
      .trim()
      .min(2, "Institution name is required")
      .optional(),
    qualification: z
      .string()
      .trim()
      .min(2, "Qualification is required")
      .optional(),
    fieldOfStudy: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    grade: z.string().trim().optional(),
    description: z.string().trim().optional(),
  });

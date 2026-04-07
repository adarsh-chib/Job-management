import z from "zod";

export const createEducationValidator = z.object({
  schoolName: z.string().min(2, "School name is required"),
  degree: z.string().min(2, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export const updateEducationValidator = createEducationValidator.partial();


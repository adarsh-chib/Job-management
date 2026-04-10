import z from "zod";

export const createProfileValidator = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).default([]),
  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  isOpenToWork: z.boolean().default(false),
  companyName: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  postedByType: z.enum(["company", "freelancer"]).optional(),
  githubUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
});

export const updatePRofileValidator = createProfileValidator.partial();

const nestedEducationValidator = z
  .object({
    id: z.string().trim().optional(),
    institutionName: z
      .string()
      .trim()
      .min(2, "Institution name must be at least 2 characters"),
    qualification: z
      .string()
      .trim()
      .min(2, "Qualification must be at least 2 characters"),
    fieldOfStudy: z.string().trim().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    grade: z.string().trim().optional(),
    description: z.string().trim().optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

const nestedExperienceValidator = z
  .object({
    id: z.string().trim().optional(),
    companyName: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters"),
    jobTitle: z
      .string()
      .trim()
      .min(2, "Job title must be at least 2 characters"),
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
  });

export const updateProfileWithRelationsValidator = z.object({
  profile: updatePRofileValidator,
  education: z.array(nestedEducationValidator).default([]),
  experience: z.array(nestedExperienceValidator).default([]),
  deletedEducationIds: z.array(z.string().trim().min(1)).default([]),
  deletedExperienceIds: z.array(z.string().trim().min(1)).default([]),
});

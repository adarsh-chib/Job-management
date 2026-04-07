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
  githubUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
});

export const updatePRofileValidator = createProfileValidator.partial();
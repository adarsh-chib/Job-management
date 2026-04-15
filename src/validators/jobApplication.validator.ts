import z from "zod";

export const createJobApplication = z.object({
  jobId: z.string().trim().min(1, "job id is required"),
  resume: z.string().trim().min(1, "resume is required"),
  coverLetter: z.string().trim().min(1, "cover letter is required"),
});

import { z } from "zod";

export const createWorkspaceValidation = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Workspace name must be at least 2 characters." })
      .max(100, { message: "Workspace name cannot exceed 100 characters." }),

    description: z
      .string()
      .trim()
      .max(500, { message: "Description cannot exceed 500 characters." })
      .optional(),

    type: z.enum(["family", "student"]),

    isPrivate: z.boolean().optional(),

    inviteCode: z
      .string()
      .trim()
      .min(4)
      .max(20)
      .optional(),
  }),
});

export const updateWorkspaceValidation = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    isPrivate: z.boolean().optional(),
  }),
});
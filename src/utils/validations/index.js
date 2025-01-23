import * as z from "zod";
import { Roles } from "../constants/roles";

const roles = Object.values(Roles);

// register form schema
export const registerSchema = z.object({
  name: z.string().min(5, { message: "Please enter name" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(roles, { message: "Please select role" }),
});

// login form schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Please enter password" }),
});

export const assessmentDetailsSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  experience: z
    .string()
    .min(1, { message: "Experience must be at least 1" })
    .max(50, { message: "Experience must be less than 50" })
    .nullable(),
  designation: z
    .string()
    .min(1, { message: "Designation is required" })
    .max(100, { message: "Designation must be less than 100 characters" }),
  skills: z
    .array(
      z
        .string()
        .min(1, { message: "Skill is required" })
        .max(50, { message: "Skill must be less than 50 characters" })
    )
    .min(1, { message: "At least one skill is required" }) // Ensure at least one skill
    .max(10, { message: "You can add up to 10 skills" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  totalTopics: z
    .string()
    .min(1, { message: "Total topics must be at least 5" })
    .max(25, { message: "Total topics must be less than or equal to 25" })
    .nullable(),
  questionType: z
    .string()
    .min(1, { message: "Question type is required" })
    .nullable(),
});

export const assessmentTopicsSchema = z.object({
  topics: z.array(
    z.object({
      id: z.number(),
      topic: z.string().min(2, {
        message: "Please add a topic",
      }),
      questionType: z.string().min(1, {
        message: "Please select an option",
      }),
      difficultyLevel: z.string().min(1, {
        message: "Please select an option",
      }),
      totalQuestions: z.string().min(1, {
        message: "Please select an option",
      }),
    })
  ),
});

const optionSchema = z.object({
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export const assessmentQuestionsSchema = z.object({
  question: z.string(),
  options: z.union([
    z.array(optionSchema).nonempty("Options must not be empty"),
    z.literal(null),
  ]),
});

export const assessmentRegisterSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().email({ message: "Please enter valid email" }),
});

export const linkedInSchema = z.object({
  linkedin: z
    .string()
    .url({ message: "Please enter valid url" })
    .refine((url) => url.startsWith("https://www.linkedin.com/"), {
      message: "Please enter a valid linkedIn URL",
    }),
});

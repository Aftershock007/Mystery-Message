import { z } from "zod"
import {
  USERNAME_REGEX,
  EMAIL_REGEX,
  CAPITAL_CASE_REGEX,
  SMALL_CASE_REGEX,
  DIGIT_REGEX,
  SPECIAL_CHARACTER_REGEX
} from "@/constants"

function validateRegex(regex: RegExp, value: string): boolean {
  return regex.test(value)
}

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(USERNAME_REGEX, "Username must not contain any special characters")

export const emailValidation = z
  .string()
  .regex(EMAIL_REGEX, "Invalid email address")

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .refine((value) => validateRegex(CAPITAL_CASE_REGEX, value), {
    message: "Password must contain at least one uppercase letter"
  })
  .refine((value) => validateRegex(SMALL_CASE_REGEX, value), {
    message: "Password must contain at least one lowercase letter"
  })
  .refine((value) => validateRegex(DIGIT_REGEX, value), {
    message: "Password must contain at least one digit"
  })
  .refine((value) => validateRegex(SPECIAL_CHARACTER_REGEX, value), {
    message: "Password must contain at least one special character"
  })

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation
})

import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponseType } from "@/types/ApiResponseType"

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponseType> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, verifyCode })
    })
    return {
      status: 200,
      success: true,
      message: "Verification email send successfully"
    }
  } catch (error) {
    console.error("Error sending verification email", error)
    return {
      status: 400,
      success: false,
      message: "Failed to send verification email"
    }
  }
}

import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { z } from "zod"
import { emailValidation } from "@/schemas/signUp.schema"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"

const EmailQuerySchema = z.object({
  email: emailValidation
})

export async function GET(request: Request) {
  await dbConnect()
  try {
    const { searchParams } = new URL(request.url)
    const queryParam = {
      email: searchParams.get("email")
    }
    const result = EmailQuerySchema.safeParse(queryParam)
    if (!result.success) {
      const emailErrors = result.error.format().email?._errors || []
      return Response.json(
        new ApiError(
          400,
          emailErrors?.length > 0
            ? emailErrors.join(", ")
            : "Invalid query parameters"
        ),
        { status: 400 }
      )
    }
    const { email } = result.data
    const existingVerifiedUser = await UserModel.findOne({ email })
    if (existingVerifiedUser) {
      return Response.json(new ApiError(400, "Email is already taken"), {
        status: 400
      })
    }
    return Response.json(new ApiResponse(200, "Email is unique"), {
      status: 200
    })
  } catch (error: any) {
    return Response.json(new ApiError(500, "Error checking email", error), {
      status: 500
    })
  }
}

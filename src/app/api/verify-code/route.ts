import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUp.schema"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"

const UsernameQuerySchema = z.object({
  username: usernameValidation
})

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, code } = await request.json()
    const decodedUsername = decodeURIComponent(username)
    const queryParam = {
      username: decodedUsername
    }
    const result = UsernameQuerySchema.safeParse(queryParam)
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json(
        new ApiError(
          400,
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters"
        ),
        { status: 400 }
      )
    }
    const user = await UserModel.findOne({ username: result.data.username })
    if (!user) {
      return Response.json(new ApiError(404, "User not found"), { status: 404 })
    }
    if (user.isVerified) {
      return Response.json(new ApiError(400, "User is already verified"), {
        status: 400
      })
    }
    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
    if (isCodeValid && isCodeNotExpired) {
      await user.updateOne({ isVerified: true })
      return Response.json(
        new ApiResponse(200, "Account verified successfully"),
        {
          status: 200
        }
      )
    } else if (!isCodeNotExpired) {
      return Response.json(
        new ApiError(
          400,
          "Verification code has been expired, please signup again to get a new code"
        ),
        {
          status: 400
        }
      )
    } else {
      return Response.json(new ApiError(400, "Incorrect verification code"), {
        status: 400
      })
    }
  } catch (error: any) {
    return Response.json(new ApiError(500, "Error verifying user", error), {
      status: 500
    })
  }
}

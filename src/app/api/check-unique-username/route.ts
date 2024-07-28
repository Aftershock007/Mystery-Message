import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUp.schema"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"

const UsernameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(request: Request) {
  await dbConnect()
  try {
    const { searchParams } = new URL(request.url)
    const queryParam = {
      username: searchParams.get("username")
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
    const { username } = result.data
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true
    })
    if (existingVerifiedUser) {
      return Response.json(new ApiError(400, "Username is already taken"), {
        status: 400
      })
    }
    return Response.json(new ApiResponse(200, "Username is unique"), {
      status: 200
    })
  } catch (error: any) {
    return Response.json(new ApiError(500, "Error checking username", error), {
      status: 500
    })
  }
}

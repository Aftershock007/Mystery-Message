import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"
import { sendVerificationEmail } from "@/utils/sendVerificationEmail"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, email, password } = await request.json()
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })
    if (existingUserVerifiedByUsername) {
      return Response.json(new ApiError(400, "Username is already taken"), {
        status: 400
      })
    }
    const existingUserByEmail = await UserModel.findOne({ email })
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyCodeExpiry = new Date(Date.now() + 3600000)
    let userUpdated = false
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          new ApiError(400, "User already exists with this email"),
          { status: 400 }
        )
      } else {
        if (username !== existingUserByEmail.username) {
          return Response.json(new ApiError(400, "Username can't be changed"), {
            status: 400
          })
        }
        await existingUserByEmail.updateOne({
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry
        })
      }
    } else {
      userUpdated = true
      await UserModel.findOneAndUpdate(
        { username },
        {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
          isVerified: false,
          isAcceptingMessage: true
        },
        { upsert: true, new: true }
      )
    }
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )
    if (!emailResponse.success) {
      return Response.json(new ApiError(500, emailResponse.message), {
        status: 500
      })
    }
    return Response.json(
      new ApiResponse(
        201,
        !userUpdated
          ? "User registered successfully, please verify your email"
          : "User updated successfully, please verify your email"
      ),
      { status: 201 }
    )
  } catch (error: any) {
    return Response.json(new ApiError(500, "Error registering user", error), {
      status: 500
    })
  }
}

import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"

export async function POST(request: Request) {
  await dbConnect()
  const { username, content } = await request.json()
  try {
    const user = await UserModel.findOne({ username })
    if (!user) {
      return Response.json(new ApiError(404, "User not found"), {
        status: 404
      })
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        new ApiError(403, "User is not accepting messages"),
        {
          status: 403
        }
      )
    }
    const newMessage = { content, createdAt: new Date() }
    await UserModel.updateOne({ username }, { $push: { messages: newMessage } })
    return Response.json(new ApiResponse(200, "Message sent successfully"), {
      status: 200
    })
  } catch (error: any) {
    return Response.json(
      new ApiError(500, "Error in sending messages", error),
      {
        status: 500
      }
    )
  }
}

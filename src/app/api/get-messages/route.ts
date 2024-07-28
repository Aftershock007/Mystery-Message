import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"
import mongoose from "mongoose"

export async function GET() {
  await dbConnect()
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (!session || !user) {
    return Response.json(new ApiError(401, "Not authenticated"), {
      status: 401
    })
  }
  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    const userMessages = await UserModel.aggregate([
      {
        $match: { _id: userId }
      },
      {
        $unwind: "$messages"
      },
      {
        $sort: { "messages.createdAt": -1 }
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } }
      }
    ]).exec()
    if (!userMessages || userMessages.length === 0) {
      return Response.json(new ApiResponse(200, "No Messages"), {
        status: 200
      })
    }
    const user = await UserModel.findById(userId)
    return Response.json(
      new ApiResponse(
        200,
        "Successfully getting messages",
        user?.isAcceptingMessage,
        userMessages[0].messages
      ),
      {
        status: 200
      }
    )
  } catch (error: any) {
    return Response.json(
      new ApiError(500, "Error in getting messages", error),
      {
        status: 500
      }
    )
  }
}

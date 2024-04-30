import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)
  const _user: User = session?.user as User
  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated"
      },
      {
        status: 401
      }
    )
  }
  const userId = new mongoose.Types.ObjectId(_user._id)
  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }
    ]).exec()

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: true,
          message: "No Messages"
        },
        {
          status: 200
        }
      )
    }
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("Internal server error: ", error)
    return Response.json(
      {
        success: false,
        message: "Internal server error"
      },
      {
        status: 500
      }
    )
  }
}

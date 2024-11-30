import {getServerSession} from "next-auth"
import {authOptions} from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import {ApiError} from "@/utils/ApiError"
import {ApiResponse} from "@/utils/ApiResponse"

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json(new ApiError(401, "Not authenticated"), {
            status: 401
        })
    }
    const userId = user._id
    const {acceptMessages} = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {new: true}
        )
        if (!updatedUser) {
            return Response.json(
                new ApiError(401, "Failed to update user status to accept messages"),
                {
                    status: 401
                }
            )
        }
        return Response.json(
            new ApiResponse(200, "Message acceptance status updated successfully"),
            {
                status: 200
            }
        )
    } catch (error: any) {
        return Response.json(
            new ApiError(
                500,
                "Failed to update user status to accept messages",
                error
            ),
            {
                status: 500
            }
        )
    }
}

export async function GET() {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json(new ApiError(401, "Not authenticated"), {
            status: 401
        })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(new ApiError(404, "User not found"), {
                status: 404
            })
        }
        return Response.json(
            new ApiResponse(
                200,
                "User is accepting messages",
                foundUser.isAcceptingMessage
            ),
            {
                status: 200
            }
        )
    } catch (error: any) {
        return Response.json(
            new ApiError(500, "Error in getting message acceptance status", error),
            {
                status: 500
            }
        )
    }
}

import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.model"
import {getServerSession} from "next-auth/next"
import {authOptions} from "../../auth/[...nextauth]/options"
import {ApiError} from "@/utils/ApiError"
import {ApiResponse} from "@/utils/ApiResponse"

export async function DELETE(
    request: Request,
    {params}: { params: { messageid: string } }
) {
    await dbConnect()
    const messageId = params.messageid
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json(new ApiError(401, "Not authenticated"), {
            status: 401
        })
    }
    try {
        const updatedResult = await UserModel.updateOne(
            {
                _id: user._id
            },
            {$pull: {messages: {_id: messageId}}}
        )
        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                new ApiError(404, "Message not found or already deleted"),
                {
                    status: 404
                }
            )
        }
        return Response.json(new ApiResponse(200, "Message deleted"), {
            status: 200
        })
    } catch (error: any) {
        return Response.json(new ApiError(500, "Error deleting message", error), {
            status: 500
        })
    }
}

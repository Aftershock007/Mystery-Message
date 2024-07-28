import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import dayjs from "dayjs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/Message.model"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponseType } from "@/types/ApiResponseType"

type MessageCardProp = {
  readonly message: Message
  readonly onMessageDelete: (messageId: string) => void
}

export default function MessageCard({
  message,
  onMessageDelete
}: MessageCardProp) {
  const { toast } = useToast()
  async function handleDeleteConfirm() {
    try {
      const response = await axios.delete<ApiResponseType>(
        `/api/delete-message/${message._id}`
      )
      toast({
        title: response.data.message
      })
      onMessageDelete(message?._id as string)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl pr-5">{message?.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You want to delete this message?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  )
}

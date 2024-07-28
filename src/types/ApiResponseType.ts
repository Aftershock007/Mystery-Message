import { Message } from "@/models/Message.model"

export interface ApiResponseType {
  success: boolean
  status: number
  message?: string
  isAcceptingMessage?: boolean
  messages?: Array<Message>
}

import { ApiResponseType } from "@/types/ApiResponseType"
import { Message } from "@/models/Message.model"

class ApiResponse implements ApiResponseType {
  success: boolean
  status: number
  message?: string
  isAcceptingMessage?: boolean
  messages?: Array<Message>

  constructor(
    status: number,
    message?: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
  ) {
    this.success = status < 400
    this.status = status
    this.message = message
    this.isAcceptingMessage = isAcceptingMessage
    this.messages = messages
  }
}

export { ApiResponse }

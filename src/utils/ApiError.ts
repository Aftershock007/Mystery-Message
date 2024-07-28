import { ApiErrorType } from "@/types/ApiErrorType"

class ApiError implements ApiErrorType {
  success: boolean
  status: number
  message?: string
  error?: string

  constructor(status: number, message?: string, error?: string) {
    this.success = status < 400
    this.status = status
    this.message = message
    this.error = error
  }
}

export { ApiError }

import mongoose, { Schema, Document } from "mongoose"
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/constants"
import { Message, MessageSchema } from "./Message.model"

export interface User extends Document {
  username: string
  email: string
  password: string
  verifyCode: string
  verifyCodeExpiry: Date
  isVerified: boolean
  isAcceptingMessage: boolean
  messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [EMAIL_REGEX, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    match: [PASSWORD_REGEX, "Please use a valid password"]
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"]
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code is required"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false
  },
  messages: [MessageSchema]
})

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema)

export default UserModel

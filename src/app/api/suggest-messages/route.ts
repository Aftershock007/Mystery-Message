import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"
import { PROMPT } from "../../../constants"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = "edge"

export async function POST() {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt: PROMPT
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    } else {
      console.error("An unexpected error occurred: ", error)
      throw error
    }
  }
}

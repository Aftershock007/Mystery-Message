"use client"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import { useCompletion } from "ai/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import * as z from "zod"
import { ApiResponseType } from "@/types/ApiResponseType"
import Link from "next/link"
import { useParams } from "next/navigation"
import { messageSchema } from "@/schemas/message.schema"
import { v4 as uuid } from "uuid"
import { SPECIAL_CHARACTER } from "@/constants"

function parseStringMessages(messageString: string): string[] {
  return messageString.split(SPECIAL_CHARACTER)
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?"

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString
  })

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const messageContent = form.watch("content")

  const handleMessageClick = (message: string) => {
    form.setValue("content", message)
  }

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponseType>("/api/send-message", {
        ...data,
        username
      })

      toast({
        title: response.data.message,
        variant: "default"
      })
      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [clickCount, setClickCount] = useState<number>(() => {
    const savedCount = localStorage.getItem("clickCount")
    return savedCount ? parseInt(savedCount, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem("clickCount", clickCount.toString())
  }, [clickCount])

  async function fetchSuggestedMessages() {
    try {
      await complete("")
    } catch (error) {
      console.error("Error fetching messages: ", error)
      const axiosError = error as AxiosError<ApiResponseType>
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Error fetching messages",
        variant: "destructive"
      })
    } finally {
      setClickCount((prevCount) => prevCount + 1)
    }
  }

  useEffect(() => {
    if (error?.message) {
      toast({
        title: "Error",
        description: "Oops, Something went wrong!",
        variant: "destructive"
      })
    }
  }, [error])

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous Message to{" "}
                  <span className="font-bold">{username}</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading || clickCount >= 3}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">Oops, Something went wrong!</p>
            ) : (
              parseStringMessages(completion).map((message) => (
                <Button
                  key={uuid()}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

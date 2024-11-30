"use client"
import {Button} from "@/components/ui/button"
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"
import {verifySchema} from "@/schemas/verify.schema"
import {ApiResponseType} from "@/types/ApiResponseType"
import {zodResolver} from "@hookform/resolvers/zod"
import axios, {AxiosError} from "axios"
import {Loader2} from "lucide-react"
import {useParams, useRouter} from "next/navigation"
import {ChangeEvent, useState} from "react"
import {useForm} from "react-hook-form"
import * as z from "zod"

export default function VerifyAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCodeValid, setIsCodeValid] = useState(false)
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    async function onSubmit(data: z.infer<typeof verifySchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace("/sign-in")
        } catch (error) {
            console.log("Error in signin of user", error)
            const axiosError = error as AxiosError<ApiResponseType>
            toast({
                title: "Verification failed",
                description:
                    axiosError.response?.data.message ??
                    "An error occurred. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleCodeChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, "")
        form.setValue("code", value)
        setIsCodeValid(value.length === 6)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input
                                        {...field}
                                        type="tel"
                                        maxLength={6}
                                        onChange={handleCodeChange}
                                    />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!isCodeValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {ChangeEvent, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {useDebounceCallback} from "usehooks-ts"
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {signUpSchema} from "@/schemas/signUp.schema"
import axios, {AxiosError} from "axios"
import {ApiResponseType} from "@/types/ApiResponseType"
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Loader2} from "lucide-react"

export default function SignupPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [emailMessage, setEmailMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername = useDebounceCallback(setUsername, 500)
    const debouncedEmail = useDebounceCallback(setEmail, 500)
    const {toast} = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        async function checkUsernameUnique() {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get<ApiResponseType>(
                        `/api/check-unique-username?username=${username}`
                    )
                    setUsernameMessage(response.data.message ?? "")
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponseType>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique().then()
    }, [username])

    useEffect(() => {
        async function checkEmailUnique() {
            if (email) {
                setIsCheckingEmail(true)
                setEmailMessage("")
                try {
                    const response = await axios.get<ApiResponseType>(
                        `/api/check-unique-email?email=${email}`
                    )
                    setEmailMessage(response.data.message ?? "")
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponseType>
                    setEmailMessage(
                        axiosError.response?.data.message ?? "Error checking email"
                    )
                } finally {
                    setIsCheckingEmail(false)
                }
            }
        }

        checkEmailUnique().then()
    }, [email])

    const handleUsernameChange =
        (onChange: (value: string) => void) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const lowerCaseValue = e.target.value.toLowerCase()
                onChange(lowerCaseValue)
                debouncedUsername(lowerCaseValue)
            }

    const handleEmailChange =
        (onChange: (value: string) => void) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const lowerCaseValue = e.target.value.toLowerCase()
                onChange(lowerCaseValue)
                debouncedEmail(lowerCaseValue)
            }

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponseType>("/api/sign-up", data)
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.log("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponseType>
            toast({
                title: "Signup failed",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    function getUsernameColorClass(usernameMessage: string) {
        switch (usernameMessage) {
            case "Username is unique":
                return "text-green-500"
            case "Username is already taken":
                return "text-blue-500"
            default:
                return "text-red-500"
        }
    }

    function getEmailColorClass(emailMessage: string) {
        switch (emailMessage) {
            case "Email is unique":
                return "text-green-500"
            case "Email is already taken":
                return "text-blue-500"
            default:
                return "text-red-500"
        }
    }

    const isButtonDisabled =
        !form.watch("username") ||
        !form.watch("email") ||
        !form.watch("password") ||
        usernameMessage ===
        "Username must be at least 2 characters, Username must not contain any special characters" ||
        emailMessage === "Invalid email address"

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-[30rem] p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Start asking in{" "}
                        <span className="text-blue-600">Mystery Message</span>
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        placeholder="username"
                                        {...field}
                                        onChange={handleUsernameChange(field.onChange)}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${getUsernameColorClass(
                                                usernameMessage
                                            )}`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="email"
                                        {...field}
                                        onChange={handleEmailChange(field.onChange)}
                                    />
                                    {isCheckingEmail && <Loader2 className="animate-spin"/>}
                                    {!isCheckingEmail && emailMessage && (
                                        <p
                                            className={`text-sm ${getEmailColorClass(emailMessage)}`}
                                        >
                                            {emailMessage}
                                        </p>
                                    )}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="password" {...field} />
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <br/>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || isButtonDisabled}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{" "}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

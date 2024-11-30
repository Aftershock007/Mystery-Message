"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {signInSchema} from "@/schemas/signIn.schema"
import {signIn} from "next-auth/react"
import {Loader2} from "lucide-react"
import {ChangeEvent, useState} from "react"

export default function SigninPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const {toast} = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const handleIdentifierChange =
        (onChange: (value: string) => void) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                const lowerCaseValue = e.target.value.toLowerCase()
                onChange(lowerCaseValue)
            }

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        setIsSubmitting(true)
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        }
        if (result?.url) {
            router.replace("/dashboard")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-[30rem] p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to{" "}
                        <span className="text-blue-600"> Mystery Message</span>
                    </h1>
                    <p className="mb-4">Sign in to start your secret conversations</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username / Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username/email"
                                            {...field}
                                            onChange={handleIdentifierChange(field.onChange)}
                                        />
                                    </FormControl>
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
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4 mr-2">
                    <p>
                        Not a member yet?{" "}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

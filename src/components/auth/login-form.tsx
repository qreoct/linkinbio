"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { sendOTP } from "@/actions/send-otp"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { loginSchema } from "@/schemas"
import { SocialProvider } from "@/types/auth"

type LoginStep = "email" | "otp"

const otpSchema = z.object({
  code: z.string().min(6, "Please enter your OTP").max(6, "Code must be 6 digits"),
})

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("")
  const [step, setStep] = useState<LoginStep>("email")
  const [userEmail, setUserEmail] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const emailForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  })

  const handleEmailSubmit = (data: z.infer<typeof loginSchema>) => {
    setError("")
    setUserEmail(data.email)
    
    startTransition(() => {
      sendOTP(data).then((res) => {
        if (res.error) {
          setError(res.error)
        } else if (res.success) {
          setStep("otp")
          setError("")
        }
      })
    })
  }

  const handleOTPSubmit = (data: z.infer<typeof otpSchema>) => {
    setError("")
    
    startTransition(async () => {
      console.log("OTP submitted:", data.code)
      const result = await signIn("credentials", {
        email: userEmail,
        code: data.code,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid verification code. Please try again.")
        otpForm.reset()
      } else if (result?.ok) {
        // Successful login - redirect to dashboard
        window.location.href = "/dashboard"
      }
    })
  }

  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsSocialLoading(true)
    setError("")
    
    const result = await signIn(provider, {
      redirect: false,
    })
    
    if (result?.ok) {
      // Keep loading state and redirect manually
      window.location.href = result.url || DEFAULT_LOGIN_REDIRECT
      // Don't reset loading state - let the page navigation handle it
    } else {
      setIsSocialLoading(false)
      setError("Authentication failed. Please try again.")
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setError("")
    otpForm.reset()
  }

  const handleResendOTP = () => {
    setError("")
    
    startTransition(() => {
      sendOTP({ email: userEmail }).then((res) => {
        if (res.error) {
          setError(res.error)
        } else if (res.success) {
          setError("")
          // Show a brief success message or toast
          console.log("New OTP sent to", userEmail)
        }
      })
    })
  }

  const renderLoginStep = () => (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage className="text-xs text-muted-foreground">
                We&apos;ll send you a verification code to log in.
              </FormMessage>
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Send verification code"
          )}
        </Button>
      </form>
    </Form>
  )

  const renderOTPStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          We sent a code to {userEmail}.
        </p>
      </div>
      
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-8">
          <FormField
            control={otpForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                      autoFocus={true}
                      onComplete={() => handleOTPSubmit(otpForm.getValues())}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormError message={error} />
          
          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                className="flex-1" 
                onClick={handleBackToEmail}
                disabled={isPending}
              >
                Back to email
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={handleResendOTP}
                disabled={isPending}
              >
                Resend code
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )

  return (
    <div className="relative">
      <CardWrapper
        headerLabel={step === "email" ? "Sign in" : "Enter verification code"}
        footerLabel=""
        footerHref=""
        footerHrefLabel=""
                  handleSocialLoginAction={handleSocialLogin}
      >
        {step === "email" ? renderLoginStep() : renderOTPStep()}
      </CardWrapper>
      
      {(isPending || isSocialLoading) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Signing you in...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { login } from "@/actions/login"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError } from "@/components/form-error"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/schemas"

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = (data: z.infer<typeof loginSchema>) => {
    setError("")
    startTransition(() => {
      login(data).then((res) => {
        setError(res.error)
      })
    })
  }

  return (
    <CardWrapper
    headerLabel="Log in"
    footerLabel="Don&apos;t have an account?"
    footerHref="/auth/register"
    footerHrefLabel="Sign up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
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
              </FormItem>
            )}
          />
          <FormError message={error}/>
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
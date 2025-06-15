"use client"

import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

export function SocialButtons() {

  const handleLogin = (provider: "google" | "github") => {
    signIn(provider, {
      redirect: true,
      callbackUrl: "/",
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" type="button" className="w-full" onClick={() => handleLogin("github")}>
        <IconBrandGithub
          className="h-4 w-4"
        />
        <span className="sr-only">Login with Github</span>
      </Button>
      <Button variant="outline" type="button" className="w-full" onClick={() => handleLogin("google")}>
        <IconBrandGoogleFilled
          className="h-4 w-4"
        />
        <span className="sr-only">Login with Google</span>
      </Button>
    </div>
  )
}
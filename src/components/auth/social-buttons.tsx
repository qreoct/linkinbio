"use client";

import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { SocialLoginHandler } from "@/types/auth";

interface SocialButtonsProps {
  handleSocialLoginAction: SocialLoginHandler;
}

export function SocialButtons({ handleSocialLoginAction }: SocialButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => handleSocialLoginAction("github")}
      >
        <IconBrandGithub className="h-4 w-4" />
        <span className="sr-only">Login with Github</span>
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={() => handleSocialLoginAction("google")}
      >
        <IconBrandGoogleFilled className="h-4 w-4" />
        <span className="sr-only">Login with Google</span>
      </Button>
    </div>
  );
}

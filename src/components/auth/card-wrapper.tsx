import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SocialLoginHandler } from "@/types/auth";

import { SocialButtons } from "./social-buttons";

interface CardWrapperProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  headerLabel: string;
  descriptionLabel?: string;
  footerLabel?: string;
  footerHref?: string;
  footerHrefLabel?: string;
  imageSrc?: string;
  handleSocialLoginAction?: SocialLoginHandler;
}

export function CardWrapper({
  children,
  headerLabel,
  descriptionLabel,
  footerLabel,
  footerHref,
  footerHrefLabel,
  imageSrc,
  className,
  handleSocialLoginAction,
  ...props
}: CardWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className={cn("grid p-0", imageSrc && "md:grid-cols-2")}>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{headerLabel}</h1>
                {descriptionLabel && (
                  <p className="text-muted-foreground text-balance">
                    {descriptionLabel}
                  </p>
                )}
              </div>
              {children}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              {handleSocialLoginAction && (
                <SocialButtons
                  handleSocialLoginAction={handleSocialLoginAction}
                />
              )}
              {(footerLabel || (footerHref && footerHrefLabel)) && (
                <div className="text-center text-sm">
                  {footerLabel}{" "}
                  <a href={footerHref} className="underline underline-offset-4">
                    {footerHrefLabel}
                  </a>
                </div>
              )}
            </div>
          </div>
          {imageSrc && (
            <div className="bg-muted relative hidden md:block">
              <Image
                src={imageSrc}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="/terms-of-service">Terms of Service</a>{" "}
        and <a href="/privacy-policy">Privacy Policy</a>.
      </div>
    </div>
  );
}

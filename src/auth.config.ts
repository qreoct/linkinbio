import { authorizeCredentials } from "@/actions/login"
import { env } from "@/env/server"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"

const authConfig = {
  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" },
      },
      authorize: authorizeCredentials,
    }),
  ],
}

export default authConfig


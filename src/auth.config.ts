import { env } from "@/env/server"
import Github from "next-auth/providers/github"

const authConfig = {
  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
}

export default authConfig


import { useSession } from "next-auth/react"

export const useCurrentUser = () => {
  /*
  This hook is used to get the current user from the session, for client components.
  */
  const { data: session } = useSession()
  return session?.user
}
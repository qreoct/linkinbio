import { IconExclamationCircle } from "@tabler/icons-react";

interface FormErrorProps {
  message?: string
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-4 text-destructive">
      <IconExclamationCircle className="h-4 w-4" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
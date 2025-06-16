import { IconExclamationCircle } from "@tabler/icons-react";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-4">
      <IconExclamationCircle className="h-4 w-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

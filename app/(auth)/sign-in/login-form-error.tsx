import { AlertTriangle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <AlertTriangle className="h-5 w-5 " /> <p>{message}</p>
    </div>
  );
}

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IFormStateProps {
  message?: string;
  type: "error" | "success";
}

export const FormStatusMessage = ({ message, type }: IFormStateProps) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={cn(
        "flex text-xs font-medium items-center my-4 gap-2 text-secondary-foreground p-3 rounded-md",
        isError ? "bg-destructive/25" : "bg-teal-400/25"
      )}>
      {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      <p>{message}</p>
    </div>
  );
};

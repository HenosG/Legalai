import { useToast } from "@/hooks/use-toast";
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from "@/components/ui/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="group flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/5">
            {/* Semantic Icon based on variant or state */}
            <div className="mt-0.5 shrink-0">
              {variant === "destructive" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              )}
            </div>

            <div className="grid flex-1 gap-1">
              {title && <ToastTitle className="text-xs font-semibold text-zinc-900">{title}</ToastTitle>}
              {description && <ToastDescription className="text-[11px] leading-relaxed text-zinc-500">{description}</ToastDescription>}
            </div>

            {action}
            <ToastClose className="text-zinc-400 hover:text-zinc-900" />
          </Toast>
        );
      })}
      <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]" />
    </ToastProvider>
  );
}
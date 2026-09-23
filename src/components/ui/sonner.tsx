import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e4e4e7',
          color: '#18181b',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
          padding: '16px',
        },
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-900 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-zinc-500 text-xs",
          actionButton: "group-[.toast]:bg-zinc-900 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
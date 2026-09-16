import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-100 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-amber-400 group-[.toast]:text-slate-950 font-semibold group-[.toast]:hover:bg-amber-300",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400 hover:group-[.toast]:bg-slate-700",
          success:
            "group-[.toaster]:border-emerald-500/30 group-[.toaster]:text-emerald-400",
          error:
            "group-[.toaster]:border-rose-500/30 group-[.toaster]:text-rose-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

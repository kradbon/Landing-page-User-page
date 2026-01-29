import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-theme px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "ghost" && "btn-ghost border border-slate-200 text-text hover:border-slate-300 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  className,
  variant = "primary"
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-theme px-6 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "ghost" && "btn-ghost border border-slate-200 text-text hover:border-slate-300 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700",
        className
      )}
    >
      {children}
    </a>
  );
}

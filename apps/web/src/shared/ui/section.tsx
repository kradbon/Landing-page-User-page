import clsx from "clsx";
import type { ReactNode } from "react";

export function Section({
  children,
  className,
  id,
  pad
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  pad?: string;
}) {
  const padding = pad ?? "2.2rem";
  return (
    <section
      id={id}
      className={clsx("py-5", className)}
      style={{
        paddingTop: `calc(${padding} * var(--spacing-density))`,
        paddingBottom: `calc(${padding} * var(--spacing-density))`
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
    </section>
  );
}

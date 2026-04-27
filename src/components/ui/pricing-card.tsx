import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative w-full max-w-xs rounded-xl border border-[var(--border)] bg-card/90 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

function Header({
  className,
  children,
  glassEffect = true,
  ...props
}: ComponentProps<"div"> & {
  glassEffect?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mb-4 rounded-xl border border-[var(--border)] bg-secondary/50 p-4",
        className
      )}
      {...props}
    >
      {glassEffect ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-48 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 100%)",
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

function Plan({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("relative z-10 mb-4 flex items-center justify-between", className)}
      {...props}
    />
  );
}

function Description({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props} />
  );
}

function PlanName({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-medium text-muted-foreground [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "relative z-10 rounded-full border border-primary/40 bg-card/80 px-2 py-0.5 text-xs text-foreground/90",
        className
      )}
      {...props}
    />
  );
}

function Price({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("relative z-10 mb-3 flex items-end gap-1", className)}
      {...props}
    />
  );
}

function MainPrice({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("text-3xl font-extrabold tracking-tight", className)}
      {...props}
    />
  );
}

function Period({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("pb-1 text-sm text-foreground/80", className)}
      {...props}
    />
  );
}

function OriginalPrice({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-auto mr-1 text-lg line-through text-muted-foreground", className)}
      {...props}
    />
  );
}

function Body({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("space-y-6 p-3", className)} {...props} />;
}

function List({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("space-y-3", className)} {...props} />;
}

function ListItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function Separator({
  children = "Upgrade to access",
  className,
  ...props
}: ComponentProps<"div"> & {
  children?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="h-px flex-1 bg-white/20" />
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1 bg-white/20" />
    </div>
  );
}

export {
  Card,
  Header,
  Description,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  OriginalPrice,
  Body,
  List,
  ListItem,
  Separator,
};

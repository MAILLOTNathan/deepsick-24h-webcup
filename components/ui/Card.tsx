import type { ComponentProps, ReactNode } from "react";

import {
  Card as ShadcnCard,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { cn } from "@/lib/ui";

export {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};

export function Card({ className, ...props }: ComponentProps<typeof ShadcnCard>) {
  return <ShadcnCard className={cn("px-(--card-spacing)", className)} {...props} />;
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card size="sm">
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-mono text-3xl text-primary">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </Card>
  );
}

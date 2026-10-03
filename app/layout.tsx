import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/shadcn/sonner";
import { TooltipProvider } from "@/components/shadcn/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_THEME, THEME_IDS } from "@/lib/themes";

export const metadata: Metadata = {
  title: {
    default: "Nova Terra — Plateforme citoyenne",
    template: "%s · Nova Terra",
  },
  description:
    "Plateforme des services municipaux de la ville de Nova Terra : démarches, annonces et suivi des demandes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={DEFAULT_THEME}
          themes={THEME_IDS}
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
          storageKey="nt-theme"
        >
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import "./globals.css";

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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

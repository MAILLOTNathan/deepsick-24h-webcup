import type { Metadata } from "next";

import { ThemePicker } from "@/components/layout/ThemePicker";
import { ThemeGallery } from "@/components/theme/ThemeGallery";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDictionary } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  return { title: getDictionary().appearance.title };
}

export default function AppearancePage() {
  const t = getDictionary();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title={t.appearance.title}
        description={t.appearance.subtitle}
        actions={<ThemePicker />}
      />
      <ThemeGallery />
    </div>
  );
}

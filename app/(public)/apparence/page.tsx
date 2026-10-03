import { ThemePicker } from "@/components/layout/ThemePicker";
import { ThemeGallery } from "@/components/theme/ThemeGallery";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata = { title: "Apparence" };

export default function AppearancePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        title="Apparence"
        description="Dix thèmes sont disponibles — du terminal CRT à la console civique martienne. Votre choix est conservé sur cet appareil."
        actions={<ThemePicker />}
      />
      <ThemeGallery />
    </div>
  );
}

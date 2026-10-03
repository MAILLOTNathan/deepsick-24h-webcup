import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { getDictionary } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  return { title: getDictionary().publicPages.contact.title };
}

export default function ContactPage() {
  const t = getDictionary();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title={t.publicPages.contact.title} description={t.publicPages.contact.subtitle} />

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card>
          <ContactForm />
        </Card>

        <Card className="space-y-3 text-sm text-muted-foreground">
          <h2 className="font-mono text-sm uppercase tracking-wide text-foreground">
            {t.publicPages.contact.goodToKnow}
          </h2>
          <p>{t.publicPages.contact.tip1}</p>
          <p>{t.publicPages.contact.tip2}</p>
          <p className="text-xs text-muted-foreground">{t.publicPages.contact.tip3}</p>
        </Card>
      </div>
    </div>
  );
}

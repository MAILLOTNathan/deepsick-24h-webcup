import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = { title: "Contacter l'administration" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Contacter l'administration"
        description="Une question, une difficulté ? Transmettez un message aux services municipaux : une référence vous est attribuée pour suivre votre demande."
      />

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card>
          <ContactForm />
        </Card>

        <Card className="space-y-3 text-sm text-slate-400">
          <h2 className="font-mono text-sm uppercase tracking-wide text-slate-200">
            Bon à savoir
          </h2>
          <p>
            Votre message est enregistré et reçoit une référence unique affichée à l'envoi.
          </p>
          <p>
            Les agents municipaux consultent les messages depuis leur espace de travail et y
            répondent dans les meilleurs délais.
          </p>
          <p className="text-xs text-slate-500">
            Urgence ? Contactez directement les services d'urgence de la colonie.
          </p>
        </Card>
      </div>
    </div>
  );
}

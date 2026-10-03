import Link from "next/link";

import { buttonClasses } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/server";

export default function NotFound() {
  const t = getDictionary();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.notFound.code}</p>
      <h1 className="mt-4 font-mono text-3xl text-foreground">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{t.notFound.text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClasses("primary")}>
          {t.common.backHome}
        </Link>
        <Link href="/services" className={buttonClasses("secondary")}>
          {t.notFound.services}
        </Link>
      </div>
    </div>
  );
}

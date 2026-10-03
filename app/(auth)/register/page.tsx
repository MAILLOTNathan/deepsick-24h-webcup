import type { Metadata } from "next";

import { RegisterForm } from "@/components/forms/RegisterForm";
import { getDictionary } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  return { title: getDictionary().auth.registerTab };
}

export default function RegisterPage() {
  return <RegisterForm />;
}

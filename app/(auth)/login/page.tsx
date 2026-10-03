import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = { title: "Connexion" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { inscription?: string };
}) {
  return <LoginForm registered={searchParams.inscription === "1"} />;
}

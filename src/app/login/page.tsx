import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

type PageProps = {
  searchParams?:
    | {
        from?: string;
      }
    | Promise<{
        from?: string;
      }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const from = resolvedSearchParams?.from ?? "/dashboard";

  async function signInAction() {
    "use server";
    await signIn("google", { redirectTo: from });
  }

  return (
    <main className="container">
      <h1>Вход</h1>
      <form action={signInAction} className="card">
        <p className="muted">Войдите через Google для доступа к кабинету.</p>
        <button type="submit">Войти через Google</button>
      </form>
    </main>
  );
}

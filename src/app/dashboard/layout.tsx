import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const name =
    session.user.name ?? session.user.email?.split("@")[0] ?? "Пользователь";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-3xl bg-slate-100 shadow-soft">
        <DashboardSidebar
          name={name}
          image={session.user.image}
          email={session.user.email}
        />
        <main className="flex-1 bg-slate-100 px-10 py-10">{children}</main>
      </div>
    </div>
  );
}

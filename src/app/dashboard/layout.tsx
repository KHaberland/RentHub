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
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-none sm:rounded-3xl bg-slate-100 shadow-soft">
        <div className="hidden md:block">
          <DashboardSidebar
            name={name}
            image={session.user.image}
            email={session.user.email}
          />
        </div>
        <main className="flex-1 bg-slate-100 px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 overflow-x-hidden min-w-0">{children}</main>
      </div>
    </div>
  );
}

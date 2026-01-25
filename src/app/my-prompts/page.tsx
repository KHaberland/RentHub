import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MyPromptsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const apartRents = await prisma.apartRent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="container">
      <h1>Мои объявления</h1>
      {apartRents.length === 0 ? (
        <p className="muted">Пока нет объявлений.</p>
      ) : (
        <ul className="list">
          {apartRents.map((item) => (
            <li key={item.id} className="card">
              <div className="title">{item.title}</div>
              <div className="meta">{item.visibility}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

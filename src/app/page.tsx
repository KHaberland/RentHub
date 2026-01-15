import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <main className="container">
      <h1>Notes</h1>
      {notes.length === 0 ? (
        <p className="muted">No notes yet. Run the seed.</p>
      ) : (
        <ul className="list">
          {notes.map((note) => (
            <li key={note.id} className="card">
              <div className="title">{note.title}</div>
              <div className="meta">
                {new Date(note.createdAt).toLocaleString("ru-RU")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

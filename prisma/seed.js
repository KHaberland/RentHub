import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "seed@example.com" },
    update: {},
    create: {
      email: "seed@example.com",
      name: "Seed User"
    }
  });

  const count = await prisma.note.count({ where: { ownerId: user.id } });
  if (count === 0) {
    await prisma.note.create({
      data: {
        title: "First seeded note",
        ownerId: user.id
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

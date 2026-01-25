import { PrismaClient } from "@prisma/client";

const PAGE_SIZE = 10;

type DbTarget = "local" | "prod";

function getDatabaseUrl(target: DbTarget) {
  const url =
    target === "prod"
      ? process.env.DATABASE_URL_PROD
      : process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      target === "prod"
        ? "DATABASE_URL_PROD is not set"
        : "DATABASE_URL is not set"
    );
  }

  return url;
}

function quoteIdentifier(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

async function withPrisma<T>(target: DbTarget, fn: (prisma: PrismaClient) => Promise<T>) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(target)
      }
    }
  });

  try {
    return await fn(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function listTables(target: DbTarget) {
  return withPrisma(target, async (prisma) => {
    const rows = await prisma.$queryRawUnsafe<
      Array<{ table_name: string }>
    >(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_type = 'BASE TABLE'
       ORDER BY table_name`
    );

    return rows.map((row) => row.table_name);
  });
}

async function listColumns(target: DbTarget, table: string) {
  return withPrisma(target, async (prisma) => {
    return prisma.$queryRawUnsafe<
      Array<{
        column_name: string;
        data_type: string;
        is_nullable: "YES" | "NO";
        column_default: string | null;
      }>
    >(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`,
      table
    );
  });
}

async function getPrimaryKeyColumn(target: DbTarget, table: string) {
  return withPrisma(target, async (prisma) => {
    const rows = await prisma.$queryRawUnsafe<Array<{ column_name: string }>>(
      `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
       WHERE tc.constraint_type = 'PRIMARY KEY'
         AND tc.table_schema = 'public'
         AND tc.table_name = $1
       ORDER BY kcu.ordinal_position
       LIMIT 1`,
      table
    );

    return rows[0]?.column_name ?? null;
  });
}

async function countRows(target: DbTarget, table: string) {
  return withPrisma(target, async (prisma) => {
    const rows = await prisma.$queryRawUnsafe<Array<{ count: string }>>(
      `SELECT COUNT(*)::text AS count FROM ${quoteIdentifier(table)}`
    );
    return Number(rows[0]?.count ?? 0);
  });
}

async function fetchRows(target: DbTarget, table: string, orderBy: string, page: number) {
  return withPrisma(target, async (prisma) => {
    const offset = Math.max(page - 1, 0) * PAGE_SIZE;
    return prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT * FROM ${quoteIdentifier(table)}
       ORDER BY ${quoteIdentifier(orderBy)} DESC
       LIMIT ${PAGE_SIZE} OFFSET ${offset}`
    );
  });
}

async function insertRow(
  target: DbTarget,
  table: string,
  data: Record<string, unknown>
) {
  return withPrisma(target, async (prisma) => {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      throw new Error("No columns provided for insert");
    }

    const quotedColumns = columns.map((column) => quoteIdentifier(column)).join(", ");
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const values = columns.map((column) => data[column]);

    await prisma.$executeRawUnsafe(
      `INSERT INTO ${quoteIdentifier(table)} (${quotedColumns}) VALUES (${placeholders})`,
      ...values
    );
  });
}

async function updateRow(
  target: DbTarget,
  table: string,
  primaryKey: string,
  id: unknown,
  data: Record<string, unknown>
) {
  return withPrisma(target, async (prisma) => {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      throw new Error("No columns provided for update");
    }

    const setClause = columns
      .map((column, index) => `${quoteIdentifier(column)} = $${index + 1}`)
      .join(", ");
    const values = columns.map((column) => data[column]);

    await prisma.$executeRawUnsafe(
      `UPDATE ${quoteIdentifier(table)}
       SET ${setClause}
       WHERE ${quoteIdentifier(primaryKey)} = $${columns.length + 1}`,
      ...values,
      id
    );
  });
}

async function deleteRow(
  target: DbTarget,
  table: string,
  primaryKey: string,
  id: unknown
) {
  return withPrisma(target, async (prisma) => {
    await prisma.$executeRawUnsafe(
      `DELETE FROM ${quoteIdentifier(table)}
       WHERE ${quoteIdentifier(primaryKey)} = $1`,
      id
    );
  });
}

export { PAGE_SIZE, listTables, listColumns, getPrimaryKeyColumn, countRows, fetchRows, insertRow, updateRow, deleteRow };
export type { DbTarget };

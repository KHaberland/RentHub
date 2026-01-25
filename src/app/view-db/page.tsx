import {
  PAGE_SIZE,
  type DbTarget,
  countRows,
  deleteRow,
  fetchRows,
  getPrimaryKeyColumn,
  insertRow,
  listColumns,
  listTables,
  updateRow
} from "@/lib/db-admin";

type PageProps = {
  searchParams: {
    db?: DbTarget;
    table?: string;
    page?: string;
    modal?: "create" | "update" | "delete";
  } | Promise<{
    db?: DbTarget;
    table?: string;
    page?: string;
    modal?: "create" | "update" | "delete";
  }>;
};

function parsePage(value?: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

function ensureTable(tables: string[], table?: string) {
  if (!table) {
    return null;
  }
  return tables.includes(table) ? table : null;
}

function parseJsonInput(raw: string) {
  if (!raw.trim()) {
    throw new Error("JSON input is empty");
  }
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON must be an object");
  }
  return parsed as Record<string, unknown>;
}

function normalizeType(dataType: string) {
  return dataType.toLowerCase();
}

function inputTypeForColumn(dataType: string) {
  const normalized = normalizeType(dataType);
  if (normalized.includes("bool")) {
    return "checkbox";
  }
  if (
    normalized.includes("int") ||
    normalized.includes("numeric") ||
    normalized.includes("decimal") ||
    normalized.includes("real") ||
    normalized.includes("double")
  ) {
    return "number";
  }
  if (normalized.includes("timestamp") || normalized.includes("date")) {
    return "datetime-local";
  }
  return "text";
}

function parseValue(dataType: string, rawValue: FormDataEntryValue | null) {
  const normalized = normalizeType(dataType);
  if (rawValue === null || rawValue === "") {
    return undefined;
  }

  if (normalized.includes("bool")) {
    if (rawValue === "on" || rawValue === "true") {
      return true;
    }
    if (rawValue === "false") {
      return false;
    }
    throw new Error("Некорректное значение boolean");
  }

  if (
    normalized.includes("int") ||
    normalized.includes("numeric") ||
    normalized.includes("decimal") ||
    normalized.includes("real") ||
    normalized.includes("double")
  ) {
    const value = Number(rawValue);
    if (Number.isNaN(value)) {
      throw new Error("Некорректное числовое значение");
    }
    return value;
  }

  if (normalized.includes("timestamp") || normalized.includes("date")) {
    const value = new Date(String(rawValue));
    if (Number.isNaN(value.getTime())) {
      throw new Error("Некорректная дата");
    }
    return value;
  }

  return String(rawValue);
}

export default async function ViewDbPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const dbTarget = resolvedSearchParams.db ?? "local";
  const tables = await listTables(dbTarget);
  const selectedTable = ensureTable(tables, resolvedSearchParams.table);

  const page = parsePage(resolvedSearchParams.page);
  let rows: Array<Record<string, unknown>> = [];
  let totalRows = 0;
  let columns: Array<{
    column_name: string;
    data_type: string;
    is_nullable: "YES" | "NO";
    column_default: string | null;
  }> = [];
  let primaryKey: string | null = null;

  if (selectedTable) {
    columns = await listColumns(dbTarget, selectedTable);
    primaryKey = await getPrimaryKeyColumn(dbTarget, selectedTable);
    totalRows = await countRows(dbTarget, selectedTable);
    const orderBy = primaryKey ?? columns[0]?.column_name ?? "id";
    rows = await fetchRows(dbTarget, selectedTable, orderBy, page);
  }

  async function createRowAction(formData: FormData) {
    "use server";
    const table = String(formData.get("table") ?? "");
    const db = (String(formData.get("db")) as DbTarget) ?? "local";
    const allowedTables = await listTables(db);
    if (!allowedTables.includes(table)) {
      throw new Error("Table not allowed");
    }
    const schemaColumns = await listColumns(db, table);
    const data: Record<string, unknown> = {};

    for (const column of schemaColumns) {
      const value = parseValue(column.data_type, formData.get(column.column_name));
      if (value !== undefined) {
        data[column.column_name] = value;
      }
    }

    for (const column of schemaColumns) {
      const isRequired =
        column.is_nullable === "NO" && column.column_default === null;
      if (isRequired && data[column.column_name] === undefined) {
        throw new Error(`Поле ${column.column_name} обязательно`);
      }
    }

    await insertRow(db, table, data);
  }

  async function updateRowAction(formData: FormData) {
    "use server";
    const table = String(formData.get("table") ?? "");
    const db = (String(formData.get("db")) as DbTarget) ?? "local";
    const id = formData.get("id");
    const allowedTables = await listTables(db);
    if (!allowedTables.includes(table)) {
      throw new Error("Table not allowed");
    }
    const primary = await getPrimaryKeyColumn(db, table);
    if (!primary) {
      throw new Error("Primary key is required for update");
    }
    if (!id || id === "") {
      throw new Error("ID обязателен");
    }
    const schemaColumns = await listColumns(db, table);
    const data: Record<string, unknown> = {};

    for (const column of schemaColumns) {
      if (column.column_name === primary) {
        continue;
      }
      const value = parseValue(column.data_type, formData.get(column.column_name));
      if (value !== undefined) {
        data[column.column_name] = value;
      }
    }

    if (Object.keys(data).length === 0) {
      throw new Error("Нет данных для обновления");
    }

    await updateRow(db, table, primary, id, data);
  }

  async function deleteRowAction(formData: FormData) {
    "use server";
    const table = String(formData.get("table") ?? "");
    const db = (String(formData.get("db")) as DbTarget) ?? "local";
    const id = formData.get("id");
    const allowedTables = await listTables(db);
    if (!allowedTables.includes(table)) {
      throw new Error("Table not allowed");
    }
    const primary = await getPrimaryKeyColumn(db, table);
    if (!primary) {
      throw new Error("Primary key is required for delete");
    }
    if (!id || id === "") {
      throw new Error("ID обязателен");
    }
    await deleteRow(db, table, primary, id);
  }

  const maxPage = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(maxPage, page + 1);
  const modal = resolvedSearchParams.modal;

  return (
    <main className="container">
      <h1>view-db</h1>

      <form className="card" method="get">
        <div className="row">
          <label>
            База
            <select name="db" defaultValue={dbTarget}>
              <option value="local">Локальная</option>
              <option value="prod">Рабочая</option>
            </select>
          </label>
          <label>
            Таблица
            <select name="table" defaultValue={selectedTable ?? ""}>
              <option value="">-- выбрать --</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Открыть</button>
        </div>
      </form>

      {selectedTable ? (
        <>
          <section className="card">
            <div className="row space-between">
              <div>
                <strong>Таблица:</strong> {selectedTable}
              </div>
              <div>
                Страница {page} из {maxPage} (всего {totalRows})
              </div>
            </div>
            <div className="muted">
              Колонки:{" "}
              {columns.map((column) => (
                <span key={column.column_name} className="pill">
                  {column.column_name}
                </span>
              ))}
            </div>
            <div className="row space-between">
              <form method="get">
                <input type="hidden" name="db" value={dbTarget} />
                <input type="hidden" name="table" value={selectedTable} />
                <input type="hidden" name="page" value={prevPage} />
                <button type="submit" disabled={page <= 1}>
                  Назад
                </button>
              </form>
              <form method="get">
                <input type="hidden" name="db" value={dbTarget} />
                <input type="hidden" name="table" value={selectedTable} />
                <input type="hidden" name="page" value={nextPage} />
                <button type="submit" disabled={page >= maxPage}>
                  Вперёд
                </button>
              </form>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.column_name}>{column.column_name}</th>
                    ))}
                    <th>CRUD</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.column_name}>
                          {String(row[column.column_name] ?? "")}
                        </td>
                      ))}
                      <td>
                        <form action={deleteRowAction}>
                          <input type="hidden" name="db" value={dbTarget} />
                          <input type="hidden" name="table" value={selectedTable} />
                          <input
                            type="hidden"
                            name="id"
                            value={
                              primaryKey
                                ? String(row[primaryKey] ?? "")
                                : ""
                            }
                          />
                          <button type="submit" disabled={!primaryKey}>
                            Удалить
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="muted">
                        Нет данных
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <h2>CRUD</h2>
            <div className="row">
              <a
                className="button-link"
                href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}&modal=create`}
              >
                Создать
              </a>
              <a
                className="button-link"
                href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}&modal=update`}
              >
                Обновить
              </a>
              <a
                className="button-link"
                href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}&modal=delete`}
              >
                Удалить
              </a>
            </div>
          </section>

          {modal === "create" ? (
            <dialog open className="modal">
              <form action={createRowAction} className="modal-card">
                <h3>Создать запись</h3>
                <input type="hidden" name="db" value={dbTarget} />
                <input type="hidden" name="table" value={selectedTable} />
                <div className="form-grid">
                  {columns.map((column) => (
                    <label key={column.column_name}>
                      {column.column_name}{" "}
                      <span className="muted">({column.data_type})</span>
                      <input
                        name={column.column_name}
                        type={inputTypeForColumn(column.data_type)}
                        placeholder={
                          column.column_default
                            ? `default: ${column.column_default}`
                            : column.is_nullable === "YES"
                            ? "необязательно"
                            : "обязательно"
                        }
                      />
                    </label>
                  ))}
                </div>
                <div className="row space-between">
                  <a
                    className="button-link"
                    href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}`}
                  >
                    Закрыть
                  </a>
                  <button type="submit">Создать</button>
                </div>
              </form>
            </dialog>
          ) : null}

          {modal === "update" ? (
            <dialog open className="modal">
              <form action={updateRowAction} className="modal-card">
                <h3>Обновить запись</h3>
                <input type="hidden" name="db" value={dbTarget} />
                <input type="hidden" name="table" value={selectedTable} />
                <label>
                  ID (primary key)
                  <input type="text" name="id" disabled={!primaryKey} />
                </label>
                <div className="form-grid">
                  {columns
                    .filter((column) => column.column_name !== primaryKey)
                    .map((column) => (
                      <label key={column.column_name}>
                        {column.column_name}{" "}
                        <span className="muted">({column.data_type})</span>
                        <input
                          name={column.column_name}
                          type={inputTypeForColumn(column.data_type)}
                          placeholder="необязательно"
                        />
                      </label>
                    ))}
                </div>
                <div className="row space-between">
                  <a
                    className="button-link"
                    href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}`}
                  >
                    Закрыть
                  </a>
                  <button type="submit" disabled={!primaryKey}>
                    Обновить
                  </button>
                </div>
              </form>
            </dialog>
          ) : null}

          {modal === "delete" ? (
            <dialog open className="modal">
              <form action={deleteRowAction} className="modal-card">
                <h3>Удалить запись</h3>
                <input type="hidden" name="db" value={dbTarget} />
                <input type="hidden" name="table" value={selectedTable} />
                <label>
                  ID (primary key)
                  <input type="text" name="id" disabled={!primaryKey} />
                </label>
                <div className="row space-between">
                  <a
                    className="button-link"
                    href={`/view-db?db=${dbTarget}&table=${selectedTable}&page=${page}`}
                  >
                    Закрыть
                  </a>
                  <button type="submit" disabled={!primaryKey}>
                    Удалить
                  </button>
                </div>
              </form>
            </dialog>
          ) : null}
        </>
      ) : (
        <p className="muted">Выберите базу и таблицу, затем нажмите «Открыть».</p>
      )}
    </main>
  );
}

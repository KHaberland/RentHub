# RentHub Notes (Next.js + Prisma + Neon)

Минимальный проект с App Router и чтением данных из NeonDB.

## Локальный запуск

1) Установите Node.js LTS.

2) Установите зависимости:

```
npm install
```

3) Создайте файл `.env` в корне:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
```

4) Сгенерируйте Prisma Client и примените миграцию:

```
npm run prisma:migrate
npm run seed
```

5) Запустите dev-сервер:

```
npm run dev
```

## Деплой на Vercel

- Укажите переменную окружения `DATABASE_URL` в настройках проекта.
- Команды сборки/старта: стандартные Next.js (`npm run build`, `npm run start`).

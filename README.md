# RentHub

**RentHub** — сервис объявлений аренды жилья, где пользователи могут:

- Искать квартиры, комнаты или другое жильё для аренды
- Просматривать объявления с подробным описанием и фотографиями
- Обмениваться информацией с владельцами или агентами
- Фильтровать предложения по городу, району, цене и другим параметрам

На платформе собраны предложения по аренде жилья (краткосрочная и долгосрочная аренда).

## Технологии

- **Next.js** (App Router, TypeScript)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (хостинг)

## Локальный запуск

1) Установите Node.js LTS.

2) Установите зависимости:

```
npm install
```

3) Создайте файл `.env` в корне:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AUTH_SECRET="long-random-secret"
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

1. Подключите репозиторий к Vercel
2. Укажите переменную окружения `DATABASE_URL` в настройках проекта
3. Команды сборки/старта используются стандартные Next.js

## Демо

[https://renthub-ecru.vercel.app](https://renthub-ecru.vercel.app)

## Лицензия

MIT

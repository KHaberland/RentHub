# Настройка Google OAuth для RentHub

Ниже — полный список шагов, чтобы включить вход через Google.

## 1) Создать OAuth‑клиент в Google

1. Откройте [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте новый проект или выберите существующий.
3. Перейдите в **APIs & Services → OAuth consent screen**:
   - Тип: External (или Internal, если Google Workspace).
   - Заполните App name, support email и сохраните.
4. Перейдите в **APIs & Services → Credentials**:
   - Нажмите **Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Authorized redirect URIs добавьте:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<ваш-домен>/api/auth/callback/google`
5. Скопируйте **Client ID** и **Client Secret**.

## 2) Настроить переменные окружения

Локально (файл `.env`):

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
AUTH_SECRET="длинный-случайный-секрет"
```

В Vercel (Project → Settings → Environment Variables):

```
DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
AUTH_SECRET
```

## 3) Применить миграции и сгенерировать Prisma Client

```
npx prisma migrate deploy
npm run prisma:generate
```

## 4) Запуск приложения

```
npm run dev
```

Проверка:
- Откройте `http://localhost:3000/login`
- Нажмите «Войти через Google»
- После входа вы попадёте на `/dashboard`

## 5) Проверка на проде

- Откройте `https://<ваш-домен>/login`
- Убедитесь, что в Google OAuth добавлен правильный redirect URI:
  `https://<ваш-домен>/api/auth/callback/google`

## Примечания

- `AUTH_SECRET` можно сгенерировать командой:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Если пользователь уже авторизован, `/login` делает редирект в `/dashboard`.

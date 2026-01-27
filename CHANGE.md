# CHANGE.md

## Проект
RentHub (Next.js App Router + TypeScript + Tailwind + shadcn/ui + Prisma + Neon/Postgres + Auth)

## Задача
Сделать главную страницу с двумя разделами публичных промтов:
1) Новые — сортировка по `createdAt` desc  
2) Популярные — сортировка по количеству лайков desc  
На главной показываются только PUBLIC промты. Гостям запрещено редактирование/CRUD.

## Что нужно реализовать

### UI
- Header (в `components/layout/`):
  - Лого/название ProStore → ссылка на `/`
  - Навигация: Главная, Каталог, Мои промты
  - Справа: Войти/Выйти, мини-аватар, имя (если есть)
- Footer (в `components/layout/`):
  - `(с) ProStore + год`
  - Ссылки: Политика, Контакты
- Главная страница:
  - Hero: заголовок, подзаголовок, кнопка “Добавить промт”
    - Для гостя: ведёт на `/auth/signin` (или текущий путь логина) + подсказка
  - Два списка:
    - “Новые” (последние 10–20)
    - “Популярные” (топ 10–20 по лайкам)
  - Карточка промта:
    - Заголовок, автор, дата
    - Теги (если есть)
    - Кнопка “Открыть” → `/prompts/[id]`
    - Счётчик лайков + кнопка лайка (если лайки есть)
    - **Без кнопок редактирования/удаления на главной**
- Адаптивность: аккуратный вид на мобильном

### Данные (Prisma)
- Запросы:
  - `recentPrompts`: `where { isPublic: true } orderBy { createdAt: "desc" } take N`
  - `popularPrompts`: `where { isPublic: true } orderBy likesCount desc take N`
- Лайки:
  - `likesCount` через `Prisma _count` (или поле-агрегат)
  - `likedByMe` если есть сессия: отдельный запрос по `promptIds`, затем `Set`

### Архитектура
- Общий layout:
  - `app/layout.tsx` подключает `Header` и `Footer`
- Главная:
  - `app/page.tsx` — Server Component
  - Получает `session` (если есть) и данные из Prisma
  - Рендерит 2 секции: “Новые”, “Популярные”
- Компоненты:
  - `PromptCard` (server-safe или client-only частично)
  - `LikeButton` — client component
  - **Сорт/переключатели не нужны**

### Права доступа
- CRUD и переключение public/private **только** для авторизованных и на соответствующих страницах
- На главной и в публичном каталоге нет редактирования
- Если есть страницы редактирования — guard: без session → редирект на login или 403

## Примечания по реализации
- Использовать shadcn/ui компоненты: `Card`, `Button`, `Badge`, `Separator`, `DropdownMenu`, `Skeleton` (опционально)
- Не ломать существующий функционал
- Сначала проверить актуальные названия полей в `prisma/schema.prisma` (например `visibility` вместо `isPublic`)

## Пример запросов (псевдокод)
```ts
const recentPrompts = await prisma.prompt.findMany({
  where: { isPublic: true },
  orderBy: { createdAt: "desc" },
  take: 20,
  include: { _count: { select: { likes: true } } }
});

const popularPrompts = await prisma.prompt.findMany({
  where: { isPublic: true },
  orderBy: { likes: { _count: "desc" } },
  take: 20,
  include: { _count: { select: { likes: true } } }
});

const likedByMe = session
  ? new Set(
      (await prisma.like.findMany({
        where: { userId: session.user.id, promptId: { in: ids } },
        select: { promptId: true }
      })).map((row) => row.promptId)
    )
  : new Set();
```

## Что вывести в отчёте после реализации
- список созданных/изменённых файлов
- ключевые фрагменты кода (Header/Footer, запросы Prisma, PromptCard)
- шаги проверки (создать промт, увидеть в “Новые/Популярные”, лайк, редактирование только в личном кабинете)

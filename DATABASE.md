## Что есть в системе (сущности):

Note — заметки  
User — владелец объявлений, автор, голосующий  
ApartRent — объявление аренды (может быть приватным или публичным)  
Tag — метки (многие-ко-многим с ApartRent)  
Vote — голос пользователя за публичное объявление  
(уникально: один пользователь → один голос на объявление)  
(опционально) Collection / Folder — папки/коллекции для организации  
(опционально) PromptVersion — версии промпта (история изменений)

## Ключевые правила:

- Публичность — это свойство ApartRent (visibility)
- Голосовать можно только по публичным  
  (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, apartRentId) — уникальный индекс

## Схема базы данных

- Note: id, ownerId → User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- ApartRent:
  - id
  - userId → User
  - title
  - content
  - description optional
  - categoryId → Category
  - visibility (PRIVATE | PUBLIC, default PRIVATE)
  - createdAt
  - updatedAt
  - publishedAt nullable
- Vote: id, userId → User, apartRentId → ApartRent, value int default 1, createdAt
- Category: id, category

### Ограничения

- Один пользователь может проголосовать за объявление только один раз:  
  `UNIQUE(userId, apartRentId)`

### Индексы

- ApartRent(userId, updatedAt)
- ApartRent(visibility, createdAt)
- Vote(apartRentId)
- Vote(userId)

### onDelete

- Cascade для связей

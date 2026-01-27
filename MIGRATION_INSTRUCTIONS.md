# Инструкция по применению миграции

## Шаги для применения изменений:

1. **Примените миграцию базы данных:**
   ```powershell
   npm run prisma:migrate
   ```
   Или вручную:
   ```powershell
   npx prisma migrate deploy
   ```

2. **Сгенерируйте Prisma Client с новыми полями:**
   ```powershell
   npm run prisma:generate
   ```
   Или:
   ```powershell
   npx prisma generate
   ```

3. **Перезапустите dev сервер:**
   ```powershell
   npm run dev
   ```

## Что было добавлено:

### Новые поля в модели RentHub:
- `price` (Decimal) - цена аренды
- `propertyType` (Enum) - тип недвижимости (APARTMENT, HOUSE, ROOM, STUDIO, COMMERCIAL)
- `area` (Float) - площадь
- `rooms` (Int?) - количество комнат
- `floor` (Int?) - этаж
- `totalFloors` (Int?) - этажность дома
- `city` (String) - город
- `district` (String?) - район
- `address` (String) - адрес
- `images` (String[]) - массив URL фотографий
- `contactPhone` (String?) - телефон для связи
- `contactEmail` (String?) - email для связи
- `showContacts` (Boolean) - показывать ли контакты

### Новые индексы:
- `RentHub_city_price_idx` - для поиска по городу и цене
- `RentHub_propertyType_price_idx` - для поиска по типу и цене

## Важно:

После применения миграции все существующие записи будут иметь значения по умолчанию:
- `price`: 0
- `propertyType`: APARTMENT
- `area`: 0
- `city`: '' (пустая строка)
- `address`: '' (пустая строка)
- `images`: [] (пустой массив)
- `showContacts`: true

Рекомендуется обновить существующие записи или создать новые с правильными данными.

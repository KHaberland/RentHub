"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { createRentHub, updateRentHub } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import type { PropertyType } from "@/app/dashboard/types";

type RentDialogProps = {
  trigger: React.ReactNode;
  initial?: {
    id: string;
    title: string;
    content: string;
    price: number;
    propertyType: PropertyType;
    area: number;
    rooms: number | null;
    floor: number | null;
    totalFloors: number | null;
    city: string;
    district: string | null;
    address: string;
    images: string[];
    contactPhone: string | null;
    contactEmail: string | null;
    showContacts: boolean;
    isPublic: boolean;
  };
};

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Квартира" },
  { value: "HOUSE", label: "Дом" },
  { value: "ROOM", label: "Комната" },
  { value: "STUDIO", label: "Студия" },
  { value: "COMMERCIAL", label: "Коммерческая" }
];

export function RentDialog({ trigger, initial }: RentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false);
  const [showContacts, setShowContacts] = useState(initial?.showContacts ?? true);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [isPending, startTransition] = useTransition();

  // Обновляем состояние только при открытии диалога
  useEffect(() => {
    if (open) {
      if (initial) {
        // При редактировании используем значения из initial только при открытии
        setIsPublic(initial.isPublic);
        setShowContacts(initial.showContacts);
        setImages(initial.images);
      } else {
        // При создании нового объявления сбрасываем к значениям по умолчанию
        setIsPublic(false);
        setShowContacts(true);
        setImages([]);
      }
    }
  }, [open]); // Убрали initial из зависимостей, чтобы не сбрасывать при изменении initial

  // Обработчик закрытия диалога - сбрасываем состояние при закрытии
  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    // Если диалог закрывается и это было создание нового объявления, сбрасываем состояние
    if (!newOpen && !initial) {
      setIsPublic(false);
      setShowContacts(true);
      setImages([]);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const priceValue = formData.get("price");
    // При редактировании используем значение из initial, если поле пустое
    let price = priceValue && priceValue !== "" ? Number(priceValue) : (initial?.price ?? 0);
    // Валидация: цена должна быть не менее 1
    if (price < 1) {
      alert("Цена должна быть не менее 1 рубля");
      return;
    }
    const propertyType = String(formData.get("propertyType") ?? "APARTMENT") as PropertyType;
    const areaValue = formData.get("area");
    // При редактировании используем значение из initial, если поле пустое
    const area = areaValue && areaValue !== "" ? Number(areaValue) : (initial?.area ?? 0);
    const roomsValue = formData.get("rooms");
    const rooms = roomsValue && roomsValue !== "" ? Number(roomsValue) : null;
    const floorValue = formData.get("floor");
    const floor = floorValue && floorValue !== "" ? Number(floorValue) : null;
    const totalFloorsValue = formData.get("totalFloors");
    const totalFloors = totalFloorsValue && totalFloorsValue !== "" && Number(totalFloorsValue) > 0 ? Number(totalFloorsValue) : null;
    const city = String(formData.get("city") ?? "");
    const district = formData.get("district") ? String(formData.get("district")) : null;
    const address = String(formData.get("address") ?? "");
    const contactPhone = formData.get("contactPhone") ? String(formData.get("contactPhone")) : null;
    const contactEmail = formData.get("contactEmail") ? String(formData.get("contactEmail")) : null;

    startTransition(async () => {
      if (initial) {
        await updateRentHub({
          id: initial.id,
          title,
          content,
          price,
          propertyType,
          area,
          rooms,
          floor,
          totalFloors,
          city,
          district,
          address,
          images,
          contactPhone,
          contactEmail,
          showContacts,
          isPublic
        });
      } else {
        await createRentHub({
          title,
          content,
          price,
          propertyType,
          area,
          rooms,
          floor,
          totalFloors,
          city,
          district,
          address,
          images,
          contactPhone,
          contactEmail,
          showContacts,
          isPublic
        });
        // Очищаем состояние после успешного создания нового объявления
        setIsPublic(false);
        setShowContacts(true);
        setImages([]);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} key={initial?.id || "new"}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col max-h-screen sm:max-h-[85vh] p-0 overflow-hidden h-screen sm:h-[85vh] sm:translate-y-[-50%]">
        <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle>
              {initial ? "Редактировать объявление" : "Новое объявление"}
            </DialogTitle>
            <DialogDescription>
              Заполните заголовок и описание, затем сохраните изменения.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="flex flex-col flex-1 min-h-0 overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 min-h-0 pb-28 sm:pb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              placeholder="Например: Квартира у моря"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Тип недвижимости</Label>
              <select
                id="propertyType"
                name="propertyType"
                defaultValue={initial?.propertyType ?? "APARTMENT"}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-200"
                required
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Цена аренды (₽/мес)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1000"
                defaultValue={initial?.price ?? 0}
                placeholder="50000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Площадь (м²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                min="0"
                step="0.1"
                defaultValue={initial?.area ?? 0}
                placeholder="50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rooms">Количество комнат</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                min="0"
                defaultValue={initial?.rooms ?? ""}
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Этаж</Label>
              <Input
                id="floor"
                name="floor"
                type="number"
                defaultValue={initial?.floor ?? ""}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalFloors">Этажей в доме</Label>
              <Input
                id="totalFloors"
                name="totalFloors"
                type="number"
                defaultValue={initial?.totalFloors ?? ""}
                placeholder="9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              name="city"
              defaultValue={initial?.city ?? ""}
              placeholder="Москва"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Район (необязательно)</Label>
            <Input
              id="district"
              name="district"
              defaultValue={initial?.district ?? ""}
              placeholder="Центральный район"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адрес</Label>
            <Input
              id="address"
              name="address"
              defaultValue={initial?.address ?? ""}
              placeholder="ул. Примерная, д. 1"
              required
            />
          </div>

          <ImageUpload images={images} onChange={setImages} />

          <div className="space-y-2">
            <Label htmlFor="content">Описание</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={initial?.content ?? ""}
              placeholder="Подробное описание недвижимости..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="text-sm font-medium text-slate-900">Контактная информация</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Телефон</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  defaultValue={initial?.contactPhone ?? ""}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={initial?.contactEmail ?? ""}
                  placeholder="example@mail.com"
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Показывать контакты
                </div>
                <div className="text-xs text-slate-500">
                  Контакты будут видны в объявлении
                </div>
              </div>
              <input
                type="checkbox"
                checked={showContacts}
                onChange={(event) => setShowContacts(event.target.checked)}
                className="h-5 w-5 cursor-pointer rounded-md border border-slate-300 accent-slate-900"
              />
            </label>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 mb-4">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Публичное объявление
              </div>
              <div className="text-xs text-slate-500">
                Будет видно всем пользователям
              </div>
            </div>
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
                className="peer h-5 w-5 cursor-pointer rounded-md border border-slate-300 accent-slate-900"
              />
              <span className="text-xs text-slate-500 peer-checked:text-slate-900">
                {isPublic ? "Публичное" : "Частное"}
              </span>
            </span>
          </label>
          </div>

          <DialogFooter className="flex-shrink-0 px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 border-t border-slate-200 bg-white flex-col sm:flex-row gap-2 sm:gap-2 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
              Отмена
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto order-1 sm:order-2">
              {isPending ? "Сохраняю..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

type RentDialogProps = {
  trigger: React.ReactNode;
  initial?: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
  };
};

export function RentDialog({ trigger, initial }: RentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(initial?.isPublic ?? false);
  const [isPending, startTransition] = useTransition();

  const initialPublic = initial?.isPublic ?? false;

  useEffect(() => {
    if (open) {
      setIsPublic(initialPublic);
    }
  }, [open, initialPublic]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");

    startTransition(async () => {
      if (initial) {
        await updateRentHub({ id: initial.id, title, content, isPublic });
      } else {
        await createRentHub({ title, content, isPublic });
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initial ? "Редактировать объявление" : "Новое объявление"}
          </DialogTitle>
          <DialogDescription>
            Заполните заголовок и описание, затем сохраните изменения.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="space-y-2">
            <Label htmlFor="content">Описание</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={initial?.content}
              placeholder="Короткое описание объявления"
              required
            />
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
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

          <DialogFooter>
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохраняю..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

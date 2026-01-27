"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
};

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 5
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`Файл ${file.name} слишком большой. Максимум ${maxSizeMB}MB`);
          continue;
        }
        validFiles.push(file);
      }
    }

    if (images.length + validFiles.length > maxImages) {
      alert(`Можно загрузить максимум ${maxImages} фотографий`);
      return;
    }

    try {
      const base64Images = await Promise.all(
        validFiles.map((file) => convertToBase64(file))
      );
      onChange([...images, ...base64Images]);
    } catch (error) {
      console.error("Ошибка загрузки изображений:", error);
      alert("Ошибка при загрузке изображений");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="images">Фотографии</Label>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-colors",
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <ImageIcon className="h-10 w-10 text-slate-400" />
            <div className="text-sm text-slate-600">
              Перетащите фотографии сюда или{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                выберите файлы
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Максимум {maxImages} фото, до {maxSizeMB}MB каждое
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Фото ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {images.length < maxImages && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Добавить еще фото
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

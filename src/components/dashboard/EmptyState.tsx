import { MessageSquare } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
        <MessageSquare className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

import { MessageSquare } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50/50 py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 shadow-sm">
        <MessageSquare className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="max-w-sm text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

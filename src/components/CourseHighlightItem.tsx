import { CheckCircle2 } from 'lucide-react';

interface CourseHighlightItemProps {
  text: string;
  className?: string;
}

export default function CourseHighlightItem({ text, className = '' }: CourseHighlightItemProps) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 text-sm text-neutral-700 shadow-sm ${className}`}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
      </span>
      <span className="text-left leading-tight">{text}</span>
    </li>
  );
}

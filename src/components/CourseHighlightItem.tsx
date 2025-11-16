import { CheckCircle2 } from 'lucide-react';

interface CourseHighlightItemProps {
  text: string;
  className?: string;
}

export default function CourseHighlightItem({ text, className = '' }: CourseHighlightItemProps) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl bg-neutral-50/80 px-3 py-2.5 text-sm text-neutral-700 ${className}`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 className="h-3 w-3" />
      </span>
      <span className="text-left leading-tight">{text}</span>
    </li>
  );
}

import { CheckCircle2 } from 'lucide-react';

interface CourseHighlightItemProps {
  text: string;
  className?: string;
}

export default function CourseHighlightItem({ text, className = '' }: CourseHighlightItemProps) {
  return (
    <li className={`flex items-start gap-2 text-sm text-neutral-700 ${className}`}>
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      <span className="text-left leading-tight">{text}</span>
    </li>
  );
}

import type { ReactNode } from 'react';

interface LegalContentProps {
  content: readonly string[];
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

const isBullet = (text: string) => {
  const trimmed = text.trim();
  return trimmed.startsWith('-') || trimmed.startsWith('•');
};

const normalizeBullet = (text: string) => text.replace(/^[-•]\s*/, '').trim();

export default function LegalContent({ content }: LegalContentProps) {
  const blocks: ContentBlock[] = [];
  let currentList: string[] | null = null;

  content.forEach((entry) => {
    if (isBullet(entry)) {
      if (!currentList) {
        currentList = [];
        blocks.push({ type: 'list', items: currentList });
      }
      currentList.push(normalizeBullet(entry));
      return;
    }

    currentList = null;
    blocks.push({ type: 'paragraph', text: entry });
  });

  const renderedBlocks: ReactNode[] = blocks.map((block, index) => {
    if (block.type === 'list') {
      return (
        <ul key={`list-${index}`} className="list-disc space-y-1 pl-5">
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p key={`paragraph-${index}`}>{block.text}</p>;
  });

  return <div className="space-y-2">{renderedBlocks}</div>;
}

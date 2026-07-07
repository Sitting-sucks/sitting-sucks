/**
 * Minimal markdown renderer for vault protocol content.
 * Handles: **bold**, bullet lists, numbered lists, paragraphs.
 * Skips fenced code blocks (the chain diagram renders those separately).
 */

import { Fragment } from 'react';

function renderInline(text: string, key: number) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Fragment key={key}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          p
        )
      )}
    </Fragment>
  );
}

export function ProtocolContent({ text, className = '' }: { text: string; className?: string }) {
  // Strip fenced code blocks (rendered elsewhere) and horizontal rules
  const stripped = text.replace(/```[\s\S]*?```/g, '').trim();
  const blocks = stripped
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !/^[-*_]{3,}$/.test(b));

  return (
    <div className={`space-y-3 text-sm text-muted-foreground leading-relaxed ${className}`}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        const isBullets = lines.every((l) => /^\s*-\s/.test(l));
        const isNumbered = lines.every((l) => /^\s*\d+[.)]\s/.test(l));

        if (isBullets) {
          return (
            <ul key={bi} className="space-y-1.5 list-disc list-outside pl-5">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*-\s/, ''), li)}</li>
              ))}
            </ul>
          );
        }
        if (isNumbered) {
          return (
            <ol key={bi} className="space-y-1.5 list-decimal list-outside pl-5">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\s*\d+[.)]\s/, ''), li)}</li>
              ))}
            </ol>
          );
        }
        return <p key={bi}>{lines.map((l, li) => renderInline(l + ' ', li))}</p>;
      })}
    </div>
  );
}

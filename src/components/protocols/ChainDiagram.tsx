/**
 * ChainDiagram — renders a compensation chain (fenced ``` block with → arrows)
 * as a vertical animated flow: root cause at top, symptom at bottom.
 */

import { ArrowDown } from 'lucide-react';

/** Extract chain nodes from the first fenced code block's → arrows,
 *  falling back to the longest inline → sequence in prose. */
export function parseChain(text: string): string[] {
  const fence = text.match(/```([\s\S]*?)```/);
  const source = fence
    ? fence[1]
    : text
        .split('\n')
        .filter((l) => (l.match(/→/g) ?? []).length >= 2)
        .sort((a, b) => (b.match(/→/g) ?? []).length - (a.match(/→/g) ?? []).length)[0] ?? '';
  return source
    .split('→')
    .map((s) => s.replace(/\n/g, ' ').replace(/^[\s*-]+|[\s*]+$/g, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);
}

export function ChainDiagram({ chainText, color = '#ef4444' }: { chainText: string; color?: string }) {
  const nodes = parseChain(chainText);
  if (nodes.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      {nodes.map((node, i) => {
        const isRoot = i === 0;
        const isSymptom = i === nodes.length - 1;
        // Fade from grey (root) toward the condition color (symptom)
        const intensity = nodes.length > 1 ? i / (nodes.length - 1) : 1;
        return (
          <div key={i} className="flex flex-col items-center gap-1 w-full max-w-md animate-fade-up" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'both' }}>
            <div
              className="w-full text-center px-4 py-2.5 rounded-lg border-2 text-sm font-medium bg-card"
              style={{
                borderColor: `${color}${Math.round(30 + intensity * 170).toString(16).padStart(2, '0')}`,
                boxShadow: isSymptom ? `0 0 16px ${color}40` : undefined,
              }}
            >
              {isRoot && (
                <span className="anatomy-label block mb-0.5" style={{ color }}>Root cause</span>
              )}
              {isSymptom && (
                <span className="anatomy-label block mb-0.5" style={{ color }}>Where you feel it</span>
              )}
              {node}
            </div>
            {i < nodes.length - 1 && <ArrowDown className="h-4 w-4 shrink-0" style={{ color }} />}
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground mt-3 text-center max-w-md">
        The symptomatic spot is not always the problematic spot — work the chain from the root.
      </p>
    </div>
  );
}

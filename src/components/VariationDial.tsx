/**
 * VariationDial — interactive easier / standard / harder selector for an
 * exercise's regression, baseline, and progression variants. The "dial"
 * that lets users tune the movement to their level instead of reading
 * three static boxes.
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';

type Level = 'easier' | 'standard' | 'harder';

const LEVELS: {
  key: Level;
  label: string;
  icon: typeof Minus;
  activeClass: string;
}[] = [
  { key: 'easier', label: 'Easier', icon: TrendingDown, activeClass: 'bg-green-600 text-white' },
  { key: 'standard', label: 'Standard', icon: Minus, activeClass: 'bg-primary text-primary-foreground' },
  { key: 'harder', label: 'Harder', icon: TrendingUp, activeClass: 'bg-orange-600 text-white' },
];

export function VariationDial({
  baseline,
  progression,
  regression,
}: {
  baseline?: string;
  progression?: string;
  regression?: string;
}) {
  const [level, setLevel] = useState<Level>('standard');

  if (!baseline && !progression && !regression) return null;

  const text =
    level === 'easier' ? regression : level === 'harder' ? progression : baseline;

  return (
    <div>
      <h4 className="anatomy-label mb-2">Dial It To Your Level</h4>
      <div className="flex rounded-lg border overflow-hidden mb-3" role="tablist">
        {LEVELS.map(({ key, label, icon: Icon, activeClass }) => {
          const available =
            key === 'easier' ? !!regression : key === 'harder' ? !!progression : !!baseline;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={level === key}
              disabled={!available}
              onClick={() => setLevel(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors',
                level === key ? activeClass : 'bg-background hover:bg-muted',
                !available && 'opacity-40 cursor-not-allowed'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50 min-h-[3rem]">
        {text || 'No variation available at this level.'}
      </p>
    </div>
  );
}

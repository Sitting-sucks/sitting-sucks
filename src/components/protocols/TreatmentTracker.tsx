/**
 * TreatmentTracker — the Universal Treatment Approach as a 4-step progress flow:
 * SMR → Awareness → Isometrics → Slow Eccentric.
 * Progress persists per-condition in localStorage (works for logged-out visitors).
 */

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProtocolContent } from './ProtocolContent';
import type { ProtocolSection } from '@/data/pain-protocols';

const storageKey = (slug: string) => `protocol-progress:${slug}`;

function loadProgress(slug: string): number {
  try {
    return Number(localStorage.getItem(storageKey(slug))) || 0;
  } catch {
    return 0;
  }
}

export function TreatmentTracker({ slug, steps, color }: { slug: string; steps: ProtocolSection[]; color: string }) {
  const [completed, setCompleted] = useState(() => loadProgress(slug));
  const [openStep, setOpenStep] = useState(() => Math.min(loadProgress(slug), steps.length - 1));

  const setProgress = (n: number) => {
    setCompleted(n);
    setOpenStep(Math.min(n, steps.length - 1));
    try {
      localStorage.setItem(storageKey(slug), String(n));
    } catch {
      /* private browsing */
    }
  };

  return (
    <div>
      {/* Step rail */}
      <div className="flex items-center mb-6">
        {steps.map((step, i) => {
          const done = i < completed;
          const active = i === openStep;
          const label = step.name.replace(/^\d+\.\s*/, '').split('(')[0].trim();
          return (
            <div key={step.name} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => setOpenStep(i)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <span
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done ? 'text-white' : active ? 'bg-card' : 'bg-muted text-muted-foreground border-transparent'
                  }`}
                  style={done ? { backgroundColor: color, borderColor: color } : active ? { borderColor: color, color } : undefined}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`text-[11px] font-medium text-center leading-tight max-w-20 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 mb-5 rounded" style={{ backgroundColor: i < completed ? color : 'hsl(var(--border))' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Open step detail */}
      <Card>
        <CardContent className="pt-5">
          <h4 className="font-semibold mb-3">{steps[openStep]?.name}</h4>
          <ProtocolContent text={steps[openStep]?.body ?? ''} />
          <div className="flex gap-2 mt-4">
            {openStep >= completed ? (
              <Button size="sm" onClick={() => setProgress(openStep + 1)} style={{ backgroundColor: color }} className="text-white hover:opacity-90">
                <Check className="h-4 w-4 mr-1" />
                Mark phase done
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setProgress(openStep)}>
                Reset to this phase
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

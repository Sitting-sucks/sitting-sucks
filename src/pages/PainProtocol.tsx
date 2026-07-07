/**
 * PainProtocol — public detail page for one condition (/pain-protocols/:slug).
 * Vault-sourced content: root cause, subtype assessment, compensation chain,
 * 4-phase treatment tracker, related exercises, trial CTA.
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, MapPin, Workflow, ListChecks, Dumbbell, Link2 } from 'lucide-react';
import { BodyMap, PAIN_CONDITION_COLORS } from '@/components/BodyMap';
import type { HighlightConfig } from '@/components/BodyMap';
import { ChainDiagram } from '@/components/protocols/ChainDiagram';
import { TreatmentTracker } from '@/components/protocols/TreatmentTracker';
import { ProtocolContent } from '@/components/protocols/ProtocolContent';
import { PAIN_PROTOCOLS } from '@/data/pain-protocols';
import { MUSCLE_MAP, getExercisesForMuscle } from '@/data/muscle-mapping';
import { exercises } from '@/data/exercises';

function Section({ icon: Icon, label, title, children }: { icon: typeof MapPin; label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-8 border-t border-border first:border-t-0">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-primary" />
        <span className="anatomy-label">{label}</span>
      </div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

const PainProtocol = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const protocol = PAIN_PROTOCOLS.find((p) => p.slug === slug);
  const [activeSubtype, setActiveSubtype] = useState(0);

  const color = protocol ? PAIN_CONDITION_COLORS[protocol.condition] ?? '#ef4444' : '#ef4444';

  const conditionMuscles = useMemo(
    () => MUSCLE_MAP.filter((m) => m.painCondition === protocol?.condition && !m.isSubgroup),
    [protocol?.condition]
  );

  const highlights: HighlightConfig[] = useMemo(
    () => conditionMuscles.map((m) => ({ muscle: m.slug, color, opacity: 0.65 })),
    [conditionMuscles, color]
  );

  const relatedExercises = useMemo(() => {
    if (!protocol) return [];
    const seen = new Map<string, (typeof exercises)[number]>();
    for (const m of conditionMuscles) {
      for (const ex of getExercisesForMuscle(exercises, m.slug)) seen.set(ex.id, ex);
    }
    return Array.from(seen.values()).slice(0, 8);
  }, [protocol, conditionMuscles]);

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg mb-4">Protocol not found.</p>
        <Button asChild variant="outline"><Link to="/pain-protocols">All protocols</Link></Button>
      </div>
    );
  }

  const relatedProtocols = protocol.related
    .map((r) => PAIN_PROTOCOLS.find((p) => p.condition === r))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Link to="/pain-protocols" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> All protocols
        </Link>

        {/* Header: title + body map */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-4">
          <div>
            <Badge className="mb-3 text-white" style={{ backgroundColor: color }}>
              Pain Protocol
            </Badge>
            <h1 className="text-4xl font-extrabold mb-3">{protocol.title.replace(/ Protocol$/, '')}</h1>
            <p className="text-muted-foreground">
              Where it comes from, how to assess it, and the exact progression to address it — root first, symptom last.
            </p>
          </div>
          <BodyMap
            exercises={exercises}
            side="front"
            style="medical"
            height="20rem"
            interactive={false}
            initialHighlights={highlights}
            showTooltips={false}
          />
        </div>

        {/* Subtype assessment */}
        {protocol.subtypes.length > 0 && (
          <Section icon={MapPin} label="Critical assessment" title="Where does it hurt?">
            <div className="flex flex-wrap gap-2 mb-4">
              {protocol.subtypes.map((s, i) => (
                <Button
                  key={s.name}
                  size="sm"
                  variant={i === activeSubtype ? 'default' : 'outline'}
                  onClick={() => setActiveSubtype(i)}
                  style={i === activeSubtype ? { backgroundColor: color } : undefined}
                  className={i === activeSubtype ? 'text-white' : ''}
                >
                  {s.name.replace(/^Type \d+:\s*/, '')}
                </Button>
              ))}
            </div>
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold mb-3">{protocol.subtypes[activeSubtype].name}</h3>
                <ProtocolContent text={protocol.subtypes[activeSubtype].body} />
              </CardContent>
            </Card>
          </Section>
        )}

        {/* Root cause */}
        <Section icon={Workflow} label="Philosophy" title="Root cause">
          <ProtocolContent text={protocol.rootCause} />
        </Section>

        {/* Compensation chain */}
        {protocol.compensationChain && (
          <Section icon={Workflow} label="Compensation chain" title="How the chain breaks down">
            <ChainDiagram chainText={protocol.compensationChain} color={color} />
            <div className="mt-4">
              <ProtocolContent text={protocol.compensationChain} />
            </div>
          </Section>
        )}

        {/* Treatment tracker */}
        {protocol.treatmentSteps.length > 0 && (
          <Section icon={ListChecks} label="Universal treatment approach" title="The progression">
            <TreatmentTracker slug={protocol.slug} steps={protocol.treatmentSteps} color={color} />
          </Section>
        )}

        {/* Full fix path */}
        {protocol.fullFixPath && (
          <Section icon={ListChecks} label="Assessment to resolution" title="Full fix path">
            <ProtocolContent text={protocol.fullFixPath} />
          </Section>
        )}

        {/* Related exercises */}
        {relatedExercises.length > 0 && (
          <Section icon={Dumbbell} label="From the library" title="Exercises for this protocol">
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedExercises.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => navigate('/exercise-library')}
                  className="text-left p-4 rounded-lg border border-border hover:border-primary/40 bg-card transition-colors"
                >
                  <p className="font-medium text-sm">{ex.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ex.description}</p>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Related protocols */}
        {relatedProtocols.length > 0 && (
          <Section icon={Link2} label="The chain continues" title="Related protocols">
            <div className="flex flex-wrap gap-2">
              {relatedProtocols.map((p) => (
                <Button key={p.slug} variant="outline" size="sm" asChild>
                  <Link to={`/pain-protocols/${p.slug}`}>
                    {p.condition}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <Card className="mt-8 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold mb-2">Want this as a guided daily program?</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              The app turns this protocol into daily workouts with tracking, progressions, and video guidance.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start 14-Day Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainProtocol;

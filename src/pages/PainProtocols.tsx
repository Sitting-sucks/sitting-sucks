/**
 * PainProtocols — public index (/pain-protocols).
 * All 7 conditions, color-coded, with affected areas and chain preview.
 */

import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { BodyMap, PAIN_CONDITION_COLORS } from '@/components/BodyMap';
import type { MuscleClickInfo } from '@/components/BodyMap';
import { PAIN_PROTOCOLS } from '@/data/pain-protocols';
import { MUSCLE_MAP } from '@/data/muscle-mapping';
import { parseChain } from '@/components/protocols/ChainDiagram';
import { exercises } from '@/data/exercises';

const PainProtocols = () => {
  const navigate = useNavigate();

  const protocolBySlugCondition = (condition?: string) =>
    PAIN_PROTOCOLS.find((p) => p.condition === condition);

  const handleMuscleClick = (info: MuscleClickInfo) => {
    const p = protocolBySlugCondition(info.painCondition);
    if (p) navigate(`/pain-protocols/${p.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <span className="anatomy-label">Pain protocols</span>
            <h1 className="text-4xl font-extrabold mt-1 mb-4">
              The symptom is the end of the chain, not the start
            </h1>
            <p className="text-muted-foreground text-lg">
              Seven desk-worker conditions, each traced from root cause to resolution.
              Tap where it hurts — on the body or below.
            </p>
          </div>
          <BodyMap
            exercises={exercises}
            side="front"
            style="medical"
            height="22rem"
            onMuscleClick={handleMuscleClick}
          />
        </div>

        {/* Protocol grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {PAIN_PROTOCOLS.map((p) => {
            const color = PAIN_CONDITION_COLORS[p.condition] ?? '#6b7280';
            const areas = [
              ...new Set(
                MUSCLE_MAP.filter((m) => m.painCondition === p.condition && !m.isSubgroup).map((m) => m.label)
              ),
            ].slice(0, 4);
            const chain = parseChain(p.compensationChain);
            return (
              <Link key={p.slug} to={`/pain-protocols/${p.slug}`}>
                <Card className="h-full card-hover border-2 hover:border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <CardTitle className="text-lg">{p.condition}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {chain.length > 1 && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {chain[0]} → … → {chain[chain.length - 1]}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {areas.map((a) => (
                        <Badge key={a} variant="secondary" className="text-[10px]">
                          {a}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      Read the protocol <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" onClick={() => navigate('/auth')}>
            Turn a protocol into your daily program
          </Button>
          <p className="text-sm text-muted-foreground mt-2">14-day free trial • No credit card</p>
        </div>
      </div>
    </div>
  );
};

export default PainProtocols;

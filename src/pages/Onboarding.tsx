import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateProgram, OnboardingData } from '@/lib/program-generator';
import {
  ArrowRight,
  ArrowLeft,
  Armchair,
  Zap,
  Target,
  Dumbbell,
  Heart,
  Clock,
  CheckCircle2,
  Sparkles,
  Activity,
  Brain,
  Gauge,
  History,
  PersonStanding,
  Timer,
  Monitor,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'bodyModel', title: 'Body Map' },
  { id: 'sitting', title: 'Your Habits' },
  { id: 'pain', title: 'Pain Points' },
  { id: 'painSeverity', title: 'Pain Severity' }, // conditional
  { id: 'painDuration', title: 'Pain Duration' }, // conditional
  { id: 'fitness', title: 'Fitness Level' },
  { id: 'activity', title: 'Activity Level' },
  { id: 'movementHistory', title: 'Movement History' },
  { id: 'posture', title: 'Posture Check' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'time', title: 'Time Commitment' },
  { id: 'workSetup', title: 'Work Setup' },
  { id: 'equipment', title: 'Equipment' },
  { id: 'program', title: 'Your Program' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

interface Option {
  value: string;
  label: string;
  desc?: string;
  icon?: LucideIcon;
}

const PAIN_OPTIONS: Option[] = [
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'upper_back', label: 'Upper Back / Shoulders' },
  { value: 'neck', label: 'Neck' },
  { value: 'hips', label: 'Hips / Hip Flexors' },
  { value: 'knees', label: 'Knees' },
  { value: 'wrists', label: 'Wrists / Hands' },
  { value: 'none', label: 'No pain currently' },
];

const PAIN_SEVERITY_OPTIONS: Option[] = [
  { value: '1-3', label: '1-3 (Mild)', desc: 'Noticeable but rarely limits me' },
  { value: '4-6', label: '4-6 (Moderate)', desc: 'Affects some daily activities' },
  { value: '7-8', label: '7-8 (Significant)', desc: 'Regularly limits what I do' },
  { value: '9-10', label: '9-10 (Severe)', desc: 'Dominates my day' },
];

const PAIN_DURATION_OPTIONS: Option[] = [
  { value: 'Less than 1 month', label: 'Less than 1 month' },
  { value: '1-3 months', label: '1-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: '6-12 months', label: '6-12 months' },
  { value: 'Over 1 year', label: 'Over 1 year' },
  { value: 'Over 5 years', label: 'Over 5 years' },
];

const MOVEMENT_HISTORY_OPTIONS: Option[] = [
  { value: 'weights', label: 'Weight training' },
  { value: 'yoga_pilates', label: 'Yoga / Pilates' },
  { value: 'sports', label: 'Sports (any kind)' },
  { value: 'dance_martial_arts', label: 'Dance / Martial arts' },
  { value: 'physical_therapy', label: 'Physical therapy' },
  { value: 'none', label: 'No prior movement experience' },
];

const POSTURE_OPTIONS: Option[] = [
  { value: 'forward_head', label: 'Forward head posture', desc: 'Head juts forward' },
  { value: 'rounded_shoulders', label: 'Rounded shoulders' },
  { value: 'anterior_tilt', label: 'Anterior pelvic tilt', desc: 'Butt sticks out, lower back arches' },
  { value: 'posterior_tilt', label: 'Posterior pelvic tilt', desc: 'Tucked pelvis, flat lower back' },
  { value: 'uneven_hips', label: 'Uneven hips', desc: 'One side higher' },
  { value: 'flat_feet', label: 'Flat feet / fallen arches' },
  { value: 'knock_knees', label: 'Knock knees / bow legs' },
  { value: 'not_sure', label: "Not sure / haven't noticed" },
];

const TIME_OPTIONS: Option[] = [
  { value: '5-10 minutes (just the essentials)', label: '5-10 minutes', desc: 'Just the essentials' },
  { value: '15-20 minutes (quick routine)', label: '15-20 minutes', desc: 'Quick routine' },
  { value: '30-45 minutes (full session)', label: '30-45 minutes', desc: 'Full session' },
  { value: '60+ minutes (comprehensive)', label: '60+ minutes', desc: 'Comprehensive' },
];

const WORK_SETUP_OPTIONS: Option[] = [
  { value: 'laptop_only', label: 'Desk job, laptop only' },
  { value: 'external_monitor', label: 'Desk job with external monitor(s)' },
  { value: 'standing_partial', label: 'Standing desk (partial sitting)' },
  { value: 'standing_mostly', label: 'Standing desk (mostly standing)' },
  { value: 'on_feet', label: 'On my feet most of the day' },
  { value: 'mixed', label: 'Mixed / varies' },
];

const EQUIPMENT_OPTIONS: Option[] = [
  { value: 'none', label: 'No equipment (bodyweight only)' },
  { value: 'bands', label: 'Resistance bands' },
  { value: 'foam_roller', label: 'Foam roller' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
];

const BODY_MODEL_OPTIONS: Option[] = [
  { value: 'female', label: 'Female body model', desc: 'All body maps in the app use this model' },
  { value: 'male', label: 'Male body model', desc: 'All body maps in the app use this model' },
];

const SITTING_OPTIONS: Option[] = [
  { value: '2-4', label: '2-4 hours', desc: 'Light sitter' },
  { value: '4-6', label: '4-6 hours', desc: 'Moderate sitter' },
  { value: '6-8', label: '6-8 hours', desc: 'Desk worker' },
  { value: '8+', label: '8+ hours', desc: 'Heavy sitter' },
];

const FITNESS_OPTIONS: Option[] = [
  { value: 'beginner', label: 'Beginner', desc: "I don't exercise regularly" },
  { value: 'intermediate', label: 'Intermediate', desc: 'I exercise 2-3 times per week' },
  { value: 'advanced', label: 'Advanced', desc: 'I exercise 4+ times per week' },
];

const ACTIVITY_OPTIONS: Option[] = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, minimal walking' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Some walking, light tasks' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'On my feet part of the day' },
  { value: 'very_active', label: 'Very Active', desc: 'Physical job or always moving' },
];

const GOAL_OPTIONS: Option[] = [
  { value: 'pain', label: 'Reduce Pain & Stiffness', icon: Heart, desc: 'Back, neck, and hip discomfort' },
  { value: 'posture', label: 'Improve Posture', icon: Zap, desc: 'Stand taller, move better' },
  { value: 'mobility', label: 'Increase Mobility', icon: Activity, desc: 'Move freely without restriction' },
  { value: 'strength', label: 'Build Strength', icon: Dumbbell, desc: 'Get stronger and more resilient' },
];

// ─── Reusable step UI ────────────────────────────────────────

function StepHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function RadioCards({
  value,
  onChange,
  options,
  idPrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  idPrefix: string;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid gap-3">
      {options.map((option) => (
        <Label
          key={option.value}
          htmlFor={`${idPrefix}-${option.value}`}
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            value === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <RadioGroupItem value={option.value} id={`${idPrefix}-${option.value}`} />
          {option.icon && (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <option.icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{option.label}</p>
            {option.desc && <p className="text-sm text-muted-foreground">{option.desc}</p>}
          </div>
          {value === option.value && <CheckCircle2 className="h-5 w-5 text-primary" />}
        </Label>
      ))}
    </RadioGroup>
  );
}

function CheckboxCards({
  values,
  onToggle,
  options,
}: {
  values: string[];
  onToggle: (v: string) => void;
  options: Option[];
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <Label
          key={option.value}
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
            values.includes(option.value) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <Checkbox checked={values.includes(option.value)} onCheckedChange={() => onToggle(option.value)} />
          <div className="flex-1">
            <span className="font-medium">{option.label}</span>
            {option.desc && <p className="text-sm text-muted-foreground">{option.desc}</p>}
          </div>
          {values.includes(option.value) && <CheckCircle2 className="h-5 w-5 text-primary ml-auto shrink-0" />}
        </Label>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    bodyModel: '',
    sittingHours: '',
    painAreas: [],
    painSeverity: '',
    painDuration: '',
    fitnessLevel: '',
    activityLevel: '',
    movementHistory: [],
    posturePatterns: [],
    goal: '',
    timeCommitment: '',
    workSetup: '',
    equipment: [],
  });

  const hasPain = data.painAreas.length > 0 && !data.painAreas.includes('none');

  // Conditional steps: pain severity/duration only shown when pain reported
  const visibleSteps = STEPS.filter(
    (s) => hasPain || (s.id !== 'painSeverity' && s.id !== 'painDuration')
  );
  const stepId: StepId = visibleSteps[Math.min(currentStep, visibleSteps.length - 1)].id;
  const progress = ((currentStep + 1) / visibleSteps.length) * 100;
  const isLastStep = currentStep >= visibleSteps.length - 1;

  const set = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  // Multi-select toggle with an exclusive "none"-style option
  const toggleMulti = (key: 'painAreas' | 'equipment' | 'movementHistory' | 'posturePatterns', value: string, exclusive?: string) => {
    setData((d) => {
      const current = d[key];
      if (exclusive && value === exclusive) return { ...d, [key]: [exclusive] };
      const filtered = exclusive ? current.filter((v) => v !== exclusive) : current;
      return {
        ...d,
        [key]: filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value],
      };
    });
  };

  const completeOnboarding = async () => {
    if (saving) return;
    setSaving(true);
    const { template, personalizationNotes, modifications } = generateProgram(data);

    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('user_preferences', JSON.stringify(data));

    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({
            onboarding_data: JSON.parse(JSON.stringify(data)),
            onboarding_complete: true,
            program_personalization: {
              templateId: template?.id ?? null,
              notes: personalizationNotes,
              modifications,
            },
          })
          .eq('id', user.id);

        if (template) {
          const { data: existingProgram } = await supabase
            .from('programs')
            .select('id')
            .eq('name', template.name)
            .eq('is_premade', true)
            .maybeSingle();

          if (existingProgram) {
            await supabase.from('client_programs').insert({
              client_id: user.id,
              program_id: existingProgram.id,
              status: 'active',
            });
          }
        }
      } catch (err) {
        console.error('Error saving program:', err);
      }
    }

    setSaving(false);
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (!isLastStep) setCurrentStep(currentStep + 1);
    else completeOnboarding();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const generated = generateProgram(data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {visibleSteps.length}</span>
            <span>{visibleSteps[Math.min(currentStep, visibleSteps.length - 1)].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-right-4" key={stepId}>
          {stepId === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto">
                <Zap className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Hey {userName}!</h1>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Let's build your personalized program. Answer a few quick questions so we can match you with the right workouts.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-6">
                <Card className="p-4 text-center">
                  <Armchair className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p className="text-sm font-medium">Combat Sitting</p>
                </Card>
                <Card className="p-4 text-center">
                  <Dumbbell className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Build Strength</p>
                </Card>
                <Card className="p-4 text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Feel Better</p>
                </Card>
              </div>
            </div>
          )}

          {stepId === 'bodyModel' && (
            <>
              <StepHeader
                icon={PersonStanding}
                title="Choose your body map"
                subtitle="We use an interactive anatomy model throughout the app — pick the one that fits you"
              />
              <RadioCards value={data.bodyModel ?? ''} onChange={(v) => set('bodyModel', v)} options={BODY_MODEL_OPTIONS} idPrefix="bodyModel" />
            </>
          )}

          {stepId === 'sitting' && (
            <>
              <StepHeader icon={Clock} title="How much do you sit daily?" subtitle="Include work, commuting, and leisure time" />
              <RadioCards value={data.sittingHours} onChange={(v) => set('sittingHours', v)} options={SITTING_OPTIONS} idPrefix="sitting" />
            </>
          )}

          {stepId === 'pain' && (
            <>
              <StepHeader icon={Heart} title="Any pain or discomfort?" subtitle="Select all that apply" />
              <CheckboxCards values={data.painAreas} onToggle={(v) => toggleMulti('painAreas', v, 'none')} options={PAIN_OPTIONS} />
            </>
          )}

          {stepId === 'painSeverity' && (
            <>
              <StepHeader icon={Gauge} title="How much does this affect your daily life?" subtitle="On a scale of 1-10" />
              <RadioCards value={data.painSeverity} onChange={(v) => set('painSeverity', v)} options={PAIN_SEVERITY_OPTIONS} idPrefix="severity" />
            </>
          )}

          {stepId === 'painDuration' && (
            <>
              <StepHeader icon={History} title="How long have you been dealing with this?" subtitle="Duration changes how we progress you" />
              <RadioCards value={data.painDuration} onChange={(v) => set('painDuration', v)} options={PAIN_DURATION_OPTIONS} idPrefix="duration" />
            </>
          )}

          {stepId === 'fitness' && (
            <>
              <StepHeader icon={Dumbbell} title="What's your fitness level?" subtitle="Be honest — we'll meet you where you are" />
              <RadioCards value={data.fitnessLevel} onChange={(v) => set('fitnessLevel', v)} options={FITNESS_OPTIONS} idPrefix="fitness" />
            </>
          )}

          {stepId === 'activity' && (
            <>
              <StepHeader icon={Activity} title="How active is your day?" subtitle="Outside of intentional exercise" />
              <RadioCards value={data.activityLevel} onChange={(v) => set('activityLevel', v)} options={ACTIVITY_OPTIONS} idPrefix="activity" />
            </>
          )}

          {stepId === 'movementHistory' && (
            <>
              <StepHeader icon={History} title="What's your experience with these movement practices?" subtitle="Select all that apply" />
              <CheckboxCards values={data.movementHistory} onToggle={(v) => toggleMulti('movementHistory', v, 'none')} options={MOVEMENT_HISTORY_OPTIONS} />
            </>
          )}

          {stepId === 'posture' && (
            <>
              <StepHeader icon={PersonStanding} title="Do you notice any of these postural patterns?" subtitle="Select all that apply — no wrong answers" />
              <CheckboxCards values={data.posturePatterns} onToggle={(v) => toggleMulti('posturePatterns', v, 'not_sure')} options={POSTURE_OPTIONS} />
            </>
          )}

          {stepId === 'goals' && (
            <>
              <StepHeader icon={Target} title="What's your main goal?" subtitle="We'll prioritize this in your program" />
              <RadioCards value={data.goal} onChange={(v) => set('goal', v)} options={GOAL_OPTIONS} idPrefix="goal" />
            </>
          )}

          {stepId === 'time' && (
            <>
              <StepHeader icon={Timer} title="How much time can you dedicate daily?" subtitle="Consistency beats duration" />
              <RadioCards value={data.timeCommitment} onChange={(v) => set('timeCommitment', v)} options={TIME_OPTIONS} idPrefix="time" />
            </>
          )}

          {stepId === 'workSetup' && (
            <>
              <StepHeader icon={Monitor} title="What's your work setup like?" subtitle="Your environment shapes your patterns" />
              <RadioCards value={data.workSetup} onChange={(v) => set('workSetup', v)} options={WORK_SETUP_OPTIONS} idPrefix="work" />
            </>
          )}

          {stepId === 'equipment' && (
            <>
              <StepHeader icon={Dumbbell} title="What equipment do you have?" subtitle="Select all that apply — no equipment is totally fine" />
              <CheckboxCards values={data.equipment} onToggle={(v) => toggleMulti('equipment', v, 'none')} options={EQUIPMENT_OPTIONS} />
            </>
          )}

          {stepId === 'program' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-success to-primary mx-auto">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Your Program is Ready</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Based on your answers, we recommend:
              </p>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-left">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{generated.template?.name ?? 'Foundation Reset'}</h3>
                    <p className="text-muted-foreground">{generated.template?.description}</p>
                    {generated.modifications.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        {generated.modifications.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>

              <p className="text-sm text-muted-foreground">
                You have full access to all programs during your 14-day free trial.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep === 0 && (
            <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="text-muted-foreground">
              Skip
            </Button>
          )}

          <Button onClick={nextStep} disabled={saving} className="gap-2">
            {isLastStep ? (
              <>
                {saving ? 'Setting up…' : 'Start Training'}
                <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

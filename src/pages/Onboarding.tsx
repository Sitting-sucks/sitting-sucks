import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';

interface OnboardingData {
  sittingHours: string;
  painAreas: string[];
  fitnessLevel: string;
  goal: string;
  activityLevel: string;
  equipment: string[];
}

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'sitting', title: 'Your Habits' },
  { id: 'pain', title: 'Pain Points' },
  { id: 'fitness', title: 'Fitness Level' },
  { id: 'activity', title: 'Activity Level' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'equipment', title: 'Equipment' },
  { id: 'program', title: 'Your Program' },
];

const PAIN_OPTIONS = [
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'upper_back', label: 'Upper Back / Shoulders' },
  { value: 'neck', label: 'Neck' },
  { value: 'hips', label: 'Hips / Hip Flexors' },
  { value: 'knees', label: 'Knees' },
  { value: 'wrists', label: 'Wrists / Hands' },
  { value: 'none', label: 'No pain currently' },
];

const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'No equipment (bodyweight only)' },
  { value: 'bands', label: 'Resistance bands' },
  { value: 'foam_roller', label: 'Foam roller' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
];

function getRecommendedProgram(data: OnboardingData): { name: string; description: string } {
  if (data.fitnessLevel === 'beginner' || data.sittingHours === '8+') {
    return {
      name: 'Foundation Reset',
      description: 'A 4-week program designed to undo the damage from prolonged sitting. Focuses on mobility, posture correction, and building a movement habit.',
    };
  }
  if (data.goal === 'pain' || data.painAreas.length >= 3) {
    return {
      name: 'Pain Relief Protocol',
      description: 'Targeted exercises to reduce pain and stiffness from sitting. Addresses common problem areas with progressive mobility and strengthening work.',
    };
  }
  if (data.goal === 'strength' || data.fitnessLevel === 'advanced') {
    return {
      name: 'Strength & Posture',
      description: 'Build functional strength while correcting postural imbalances. Combines resistance training with mobility work for desk workers who want to get strong.',
    };
  }
  return {
    name: 'Daily Movement Protocol',
    description: 'A balanced daily routine combining mobility, strength, and recovery exercises. Perfect for maintaining an active lifestyle while working a desk job.',
  };
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    sittingHours: '',
    painAreas: [],
    fitnessLevel: '',
    goal: '',
    activityLevel: '',
    equipment: [],
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('user_preferences', JSON.stringify(data));
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePainArea = (value: string) => {
    if (value === 'none') {
      setData({ ...data, painAreas: ['none'] });
      return;
    }
    const filtered = data.painAreas.filter(v => v !== 'none');
    if (filtered.includes(value)) {
      setData({ ...data, painAreas: filtered.filter(v => v !== value) });
    } else {
      setData({ ...data, painAreas: [...filtered, value] });
    }
  };

  const toggleEquipment = (value: string) => {
    if (value === 'none') {
      setData({ ...data, equipment: ['none'] });
      return;
    }
    const filtered = data.equipment.filter(v => v !== 'none');
    if (filtered.includes(value)) {
      setData({ ...data, equipment: filtered.filter(v => v !== value) });
    } else {
      setData({ ...data, equipment: [...filtered, value] });
    }
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const recommendedProgram = getRecommendedProgram(data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{STEPS[currentStep].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4">
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

          {/* Step 2: Sitting Habits */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">How much do you sit daily?</h2>
                <p className="text-muted-foreground">Include work, commuting, and leisure time</p>
              </div>

              <RadioGroup
                value={data.sittingHours}
                onValueChange={(value) => setData({ ...data, sittingHours: value })}
                className="grid gap-3"
              >
                {[
                  { value: '2-4', label: '2-4 hours', desc: 'Light sitter' },
                  { value: '4-6', label: '4-6 hours', desc: 'Moderate sitter' },
                  { value: '6-8', label: '6-8 hours', desc: 'Desk worker' },
                  { value: '8+', label: '8+ hours', desc: 'Heavy sitter' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`sitting-${option.value}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.sittingHours === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`sitting-${option.value}`} />
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    {data.sittingHours === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Pain Areas */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Any pain or discomfort?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <div className="grid gap-3">
                {PAIN_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.painAreas.includes(option.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={data.painAreas.includes(option.value)}
                      onCheckedChange={() => togglePainArea(option.value)}
                    />
                    <span className="font-medium">{option.label}</span>
                    {data.painAreas.includes(option.value) && (
                      <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </Label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Fitness Level */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">What's your fitness level?</h2>
                <p className="text-muted-foreground">Be honest — we'll meet you where you are</p>
              </div>

              <RadioGroup
                value={data.fitnessLevel}
                onValueChange={(value) => setData({ ...data, fitnessLevel: value })}
                className="grid gap-3"
              >
                {[
                  { value: 'beginner', label: 'Beginner', desc: "I don't exercise regularly" },
                  { value: 'intermediate', label: 'Intermediate', desc: 'I exercise 2-3 times per week' },
                  { value: 'advanced', label: 'Advanced', desc: 'I exercise 4+ times per week' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`fitness-${option.value}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.fitnessLevel === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`fitness-${option.value}`} />
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    {data.fitnessLevel === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Activity Level */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">How active is your day?</h2>
                <p className="text-muted-foreground">Outside of intentional exercise</p>
              </div>

              <RadioGroup
                value={data.activityLevel}
                onValueChange={(value) => setData({ ...data, activityLevel: value })}
                className="grid gap-3"
              >
                {[
                  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, minimal walking' },
                  { value: 'lightly_active', label: 'Lightly Active', desc: 'Some walking, light tasks' },
                  { value: 'moderately_active', label: 'Moderately Active', desc: 'On my feet part of the day' },
                  { value: 'very_active', label: 'Very Active', desc: 'Physical job or always moving' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`activity-${option.value}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.activityLevel === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`activity-${option.value}`} />
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    {data.activityLevel === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 6: Goals */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">What's your main goal?</h2>
                <p className="text-muted-foreground">We'll prioritize this in your program</p>
              </div>

              <RadioGroup
                value={data.goal}
                onValueChange={(value) => setData({ ...data, goal: value })}
                className="grid gap-3"
              >
                {[
                  { value: 'pain', label: 'Reduce Pain & Stiffness', icon: Heart, desc: 'Back, neck, and hip discomfort' },
                  { value: 'posture', label: 'Improve Posture', icon: Zap, desc: 'Stand taller, move better' },
                  { value: 'mobility', label: 'Increase Mobility', icon: Activity, desc: 'Move freely without restriction' },
                  { value: 'strength', label: 'Build Strength', icon: Dumbbell, desc: 'Get stronger and more resilient' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`goal-${option.value}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.goal === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`goal-${option.value}`} />
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <option.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    {data.goal === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 7: Equipment */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">What equipment do you have?</h2>
                <p className="text-muted-foreground">Select all that apply — no equipment is totally fine</p>
              </div>

              <div className="grid gap-3">
                {EQUIPMENT_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.equipment.includes(option.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox
                      checked={data.equipment.includes(option.value)}
                      onCheckedChange={() => toggleEquipment(option.value)}
                    />
                    <span className="font-medium">{option.label}</span>
                    {data.equipment.includes(option.value) && (
                      <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </Label>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Program Recommendation */}
          {currentStep === 7 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4">
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
                    <h3 className="text-xl font-bold mb-2">{recommendedProgram.name}</h3>
                    <p className="text-muted-foreground">{recommendedProgram.description}</p>
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
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep === 0 && (
            <Button variant="ghost" onClick={completeOnboarding} className="text-muted-foreground">
              Skip
            </Button>
          )}

          <Button onClick={nextStep} className="gap-2">
            {currentStep === STEPS.length - 1 ? (
              <>
                Start Training
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

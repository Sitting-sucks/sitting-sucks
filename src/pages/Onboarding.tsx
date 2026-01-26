import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRight,
  ArrowLeft,
  Armchair,
  Zap,
  Target,
  Flame,
  Trophy,
  Heart,
  Clock,
  Dumbbell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface OnboardingData {
  sittingHours: string;
  painAreas: string[];
  fitnessLevel: string;
  goal: string;
}

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'sitting', title: 'Your Habits' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'features', title: 'How It Works' },
  { id: 'start', title: 'Get Started' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    sittingHours: '',
    painAreas: [],
    fitnessLevel: '',
    goal: '',
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const completeOnboarding = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding_complete', 'true');

    // Store user preferences if needed
    if (data.sittingHours || data.goal) {
      localStorage.setItem('user_preferences', JSON.stringify(data));
    }

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

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

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
                Welcome to <span className="text-primary font-semibold">Sitting Sucks</span> - your personal guide to reversing the damage from prolonged sitting.
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
                <h2 className="text-3xl font-bold mb-2">How much do you sit?</h2>
                <p className="text-muted-foreground">
                  This helps us personalize your experience
                </p>
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
                    htmlFor={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.sittingHours === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
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

          {/* Step 3: Goals */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">What's your main goal?</h2>
                <p className="text-muted-foreground">
                  We'll tailor recommendations to help you achieve it
                </p>
              </div>

              <RadioGroup
                value={data.goal}
                onValueChange={(value) => setData({ ...data, goal: value })}
                className="grid gap-3"
              >
                {[
                  { value: 'pain', label: 'Reduce Pain & Stiffness', icon: Heart, desc: 'Back, neck, and hip discomfort' },
                  { value: 'posture', label: 'Improve Posture', icon: Zap, desc: 'Stand taller, look better' },
                  { value: 'mobility', label: 'Increase Mobility', icon: Dumbbell, desc: 'Move freely without restriction' },
                  { value: 'strength', label: 'Build Strength', icon: Trophy, desc: 'Get stronger overall' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.goal === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
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

          {/* Step 4: Features */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold mb-2">Here's how it works</h2>
                <p className="text-muted-foreground">
                  Simple features to keep you moving
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Free Anti-Sitting Guide</h3>
                      <p className="text-sm text-muted-foreground">
                        Start with our top 5 exercises designed specifically to counteract sitting damage. No subscription needed.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Build Your Streak</h3>
                      <p className="text-sm text-muted-foreground">
                        Log in daily and track your workouts. Build consistency and earn bonus points for maintaining streaks.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Earn Achievements</h3>
                      <p className="text-sm text-muted-foreground">
                        Unlock 18 achievements as you progress. From your first workout to 100-day streaks!
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 5: Get Started */}
          {currentStep === 4 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-success to-primary mx-auto">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold">You're all set!</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Let's start reversing the damage from sitting. Your body will thank you.
              </p>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <h3 className="font-semibold mb-3">Your first mission:</h3>
                <p className="text-muted-foreground mb-4">
                  Try the <span className="text-primary font-medium">Free Anti-Sitting Guide</span> - 5 essential exercises that take just 10 minutes.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>10-15 minutes</span>
                  <span className="mx-2">•</span>
                  <Dumbbell className="h-4 w-4" />
                  <span>No equipment needed</span>
                </div>
              </Card>
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
              Skip intro
            </Button>
          )}

          <Button onClick={nextStep} className="gap-2">
            {currentStep === STEPS.length - 1 ? (
              <>
                Go to Dashboard
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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  UserCheck,
  Calendar,
  MessageSquare,
  ArrowRight,
  Dumbbell,
  Target,
  TrendingUp,
  AlertTriangle,
  Shield,
  Clock,
  Zap,
  Star,
  ChevronDown,
  Play,
  Users,
  Heart,
  Award,
  Flame,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BodyMap } from '@/components/BodyMap';
import type { MuscleClickInfo, HighlightConfig } from '@/components/BodyMap';
import { MuscleInfoPanel } from '@/components/MuscleInfoPanel';
import { exercises } from '@/data/exercises';
import { PAIN_PROTOCOLS } from '@/data/pain-protocols';

// The Sitting Epidemic pattern: tight calves + traps (red), underworked glutes (grey)
const SITTING_HIGHLIGHTS: HighlightConfig[] = [
  { muscle: 'calves', color: '#ef4444', opacity: 0.6 },
  { muscle: 'gluteal', color: '#6b7280', opacity: 0.4 },
  { muscle: 'upper-trapezius', color: '#ef4444', opacity: 0.6 },
];

const Landing = () => {
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleClickInfo | null>(null);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  // Social proof stats
  const stats = [
    { value: '14 Days', label: 'Free Trial' },
    { value: '4+', label: 'Programs Included' },
    { value: '100+', label: 'Video Exercises' },
    { value: '$10', label: '/month after trial' },
  ];

  // Features
  const features = [
    {
      icon: Activity,
      title: 'Smart Workout Recommendations',
      description: 'AI-powered recommendations based on your history, goals, and muscle recovery time.',
    },
    {
      icon: Flame,
      title: 'Streak & Gamification',
      description: 'Stay motivated with streaks, achievements, and points that reward consistency.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track sets, reps, weight lifted, and see your progress over time with visual charts.',
    },
    {
      icon: Target,
      title: 'Targeted Anti-Sitting Exercises',
      description: 'Exercises specifically designed to counteract the damage from prolonged sitting.',
    },
    {
      icon: Heart,
      title: 'Personalized Programs',
      description: 'Get matched to the right program based on your goals, pain points, and fitness level.',
    },
    {
      icon: Users,
      title: '1-on-1 Coaching Available',
      description: 'Want more? Get direct access to our trainers for accountability and custom programming.',
    },
  ];

  // FAQs
  const faqs = [
    {
      question: 'How is this different from other fitness apps?',
      answer: "Sitting Sucks is specifically designed to combat the negative effects of prolonged sitting. Our exercises target the exact muscle imbalances and mobility restrictions caused by desk work, with progression systems that adapt to your level.",
    },
    {
      question: 'What do I get during the free trial?',
      answer: "Everything. Full access to all programs, exercises, video guides, tracking tools, and features for 14 days. No restrictions, no credit card required.",
    },
    {
      question: 'Do I need any equipment?',
      answer: "Most exercises can be done with no equipment at all. Some advanced progressions benefit from basic equipment like resistance bands or a foam roller, but these are optional.",
    },
    {
      question: 'How long are the workouts?',
      answer: "Workouts range from 5-minute quick sessions to 30-minute comprehensive routines. Most users start with 10-15 minute daily sessions and see significant improvements within 2 weeks.",
    },
    {
      question: 'Can I cancel anytime?',
      answer: "Absolutely. No contracts, no commitments. Cancel anytime with one click from your account settings.",
    },
    {
      question: "What's the coaching tier?",
      answer: "For $249/month you get everything in the app plus direct access to our trainers — weekly check-ins, personalized program design, direct messaging, custom modifications, and lifestyle assessments. It's for people who want accountability and expert guidance.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/e3d51457-4b9e-46e8-8a17-47f87911ecbf.png"
              alt="Sitting Sucks Logo"
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Sitting Sucks
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/pain-protocols')} className="hidden sm:flex">
              Pain Protocols
            </Button>
            <Button onClick={handleLogin} variant="ghost">
              Log In
            </Button>
            <Button onClick={handleGetStarted} className="hidden sm:flex">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: headline */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5 animate-fade-in">
                <Zap className="h-3.5 w-3.5 mr-1.5 inline" />
                Evidence-Based Movement Protocols
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-up">
                Your Body Wasn't Built to
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                  Sit All Day
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Prolonged sitting reshapes your posture and mobility. Our Anti-Sitting Protocol
                gives you the exact exercises to address the patterns desk work creates — from the ground up.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-lg px-8 gap-2 shadow-lg hover:shadow-xl transition-all animate-pulse-ring"
                >
                  Start Your Recovery
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 gap-2"
                >
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  14-Day Free Trial
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-success" />
                  No Credit Card Required
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Cancel Anytime
                </div>
              </div>
            </div>

            {/* Right: interactive body map */}
            <div className="animate-fade-in">
              <p className="anatomy-label text-center mb-3">
                Where sitting hits you — tap a muscle
              </p>
              <BodyMap
                exercises={exercises}
                side="front"
                style="medical"
                height="30rem"
                initialHighlights={SITTING_HIGHLIGHTS}
                onMuscleClick={setSelectedMuscle}
              />
            </div>
          </div>
        </div>

        {/* Muscle detail modal */}
        <MuscleInfoPanel
          muscle={selectedMuscle}
          mode="modal"
          onClose={() => setSelectedMuscle(null)}
          onExerciseClick={() => navigate('/auth')}
          onPainProtocolClick={(condition) => {
            const p = PAIN_PROTOCOLS.find((pp) => pp.condition === condition);
            if (p) navigate(`/pain-protocols/${p.slug}`);
          }}
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-destructive/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-2xl sm:text-3xl font-bold">The Sitting Epidemic</h2>
            </div>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Sitting is the new smoking. Here's what prolonged sitting is doing to your body:
            </p>
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <Card className="border-destructive/20 bg-background">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-destructive mb-2">8+ hrs</div>
                  <p className="text-muted-foreground">Average time spent sitting daily</p>
                </CardContent>
              </Card>
              <Card className="border-destructive/20 bg-background">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-destructive mb-2">80%</div>
                  <p className="text-muted-foreground">Of desk workers experience back pain</p>
                </CardContent>
              </Card>
              <Card className="border-destructive/20 bg-background">
                <CardContent className="pt-6">
                  <div className="text-5xl font-bold text-destructive mb-2">40%</div>
                  <p className="text-muted-foreground">Increased disease risk from sitting</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Fight Back</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete system designed to reverse the damage from sitting and restore your body's natural function
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <Card key={i} className="card-hover border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Sign Up Free', description: 'Create your account in 30 seconds. Full access to everything for 14 days.' },
              { step: '2', title: 'Get Matched', description: 'Answer a few questions and get assigned a program based on your goals and fitness level.' },
              { step: '3', title: 'Start Training', description: 'Follow your program, log your workouts, and start feeling the difference within your first week.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple Pricing, Full Access</h2>
            <p className="text-xl text-muted-foreground">
              Try everything free for 14 days. Then choose your plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Full App */}
            <Card className="relative overflow-hidden card-hover">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Full App Access</CardTitle>
                <CardDescription className="text-base">
                  All programs, exercises, videos, and tracking
                </CardDescription>
                <div className="text-center mt-4">
                  <span className="text-5xl font-bold">$10</span>
                  <span className="text-muted-foreground">/month</span>
                  <p className="text-sm text-success mt-1">or $60/year (save 50%)</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    'All workout programs',
                    'Full exercise library with videos',
                    'Workout logging & progress tracking',
                    'Streaks, points & gamification',
                    'Achievements & analytics',
                    'All future programs & updates',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-success" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleGetStarted} className="w-full" size="lg" variant="outline">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Coaching */}
            <Card className="relative overflow-hidden border-primary border-2 card-hover shadow-lg">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                Best Value
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">1-on-1 Coaching</CardTitle>
                <CardDescription className="text-base">
                  Direct trainer access for accountability and results
                </CardDescription>
                <div className="text-center mt-4">
                  <span className="text-5xl font-bold">$249</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { text: 'Everything in Full App Access', bold: true },
                    { text: 'Weekly 1-on-1 check-in sessions' },
                    { text: 'Personalized program design' },
                    { text: 'Direct messaging with your coach' },
                    { text: 'Custom exercise modifications' },
                    { text: 'Lifestyle & ergonomic assessments' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className={feature.bold ? 'font-medium' : ''}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleGetStarted} className="w-full" size="lg">
                  Start Coaching
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Free trial note */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success">
              <Shield className="h-5 w-5" />
              <span className="font-medium">14-Day Free Trial — No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Real Results</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of people who've transformed their mobility and eliminated pain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "After just 2 weeks, my lower back pain that I'd had for years started to disappear. This program actually works.",
                name: "Sarah M.",
                role: "Software Engineer",
              },
              {
                quote: "I've tried other fitness apps but none were designed for desk workers like me. The targeted exercises make all the difference.",
                name: "James K.",
                role: "Financial Analyst",
              },
              {
                quote: "The coaching tier is worth every penny. My coach helped me correct imbalances I didn't even know I had.",
                name: "Michelle T.",
                role: "Marketing Manager",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about Sitting Sucks
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop Letting Sitting Destroy Your Body
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join now and start feeling the difference within your first week. Your future self will thank you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="text-lg px-12 shadow-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/e3d51457-4b9e-46e8-8a17-47f87911ecbf.png"
                alt="Sitting Sucks Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Sitting Sucks</span>
            </div>
            <p className="text-muted-foreground text-center">
              Evidence-based movement protocols to counteract the damage from sitting
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

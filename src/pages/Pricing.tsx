import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, UserCheck, Calendar, MessageSquare, Flame, TrendingUp, Award, Dumbbell } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Pricing = () => {
  const { createCheckoutSession } = useSubscription();

  const handleSubscribe = async (tier: 'basic' | 'coaching') => {
    try {
      await createCheckoutSession(tier);
      toast.success(`Starting ${tier === 'basic' ? 'Full Access' : '1-on-1 Coaching'} subscription...`);
    } catch (error) {
      toast.error('Failed to start subscription process. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your health with our evidence-based movement protocols and expert coaching
          </p>
        </div>

        {/* Free Tier Banner */}
        <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Free Anti-Sitting Guide</h3>
                <p className="text-sm text-muted-foreground">Start your recovery journey at no cost</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/anti-sitting-guide">Get Free Guide</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Full App Access - Tier 1 */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <CardHeader className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Full App Access</CardTitle>
              <CardDescription>
                Complete access to all programs, tracking, and features
              </CardDescription>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Complete Anti-Sitting Daily Protocol</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Full exercise library with video guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">Workout logging & tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">Streaks, points & gamification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">Achievements & progress analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>All current & future programs</span>
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe('basic')}
                className="w-full"
                size="lg"
              >
                Get Full Access
              </Button>
            </CardContent>
          </Card>

          {/* 1-on-1 Coaching */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
            <Badge className="absolute top-4 right-4 bg-primary">Most Popular</Badge>
            <CardHeader className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">1-on-1 Online Coaching</CardTitle>
              <CardDescription>
                Personalized coaching with weekly check-ins and custom programs
              </CardDescription>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">$249</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">Everything in Full App Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Weekly 1-on-1 check-in sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Personalized movement program design</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Direct messaging with your coach</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Custom exercise modifications and progressions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Lifestyle and ergonomic assessments</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubscribe('coaching')}
                className="w-full"
                size="lg"
                variant="default"
              >
                Start Coaching
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Both plans include access to our evidence-based movement protocols designed to counteract the effects of prolonged sitting
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
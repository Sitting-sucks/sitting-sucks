import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, UserCheck, Calendar, MessageSquare } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

const Pricing = () => {
  const { createCheckoutSession } = useSubscription();

  const handleSubscribe = async (tier: 'basic' | 'coaching') => {
    try {
      await createCheckoutSession();
      toast.success(`Starting ${tier} subscription process...`);
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Full App Access */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
            <CardHeader className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Full App Access</CardTitle>
              <CardDescription>
                Complete access to all movement protocols and exercises
              </CardDescription>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">$30</span>
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
                  <span>Full exercise library with video demonstrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Equipment recommendations and alternatives</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Progress tracking and movement analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Lifetime updates and new protocols</span>
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
                <span className="text-4xl font-bold">$200</span>
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
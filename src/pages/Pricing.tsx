import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, UserCheck, Calendar, MessageSquare, Flame, TrendingUp, Award, Dumbbell, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (tier: 'app' | 'coaching') => {
    if (tier === 'app') {
      const url = billingPeriod === 'monthly'
        ? 'STRIPE_MONTHLY_URL'
        : 'STRIPE_YEARLY_URL';
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('STRIPE_COACHING_URL', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Honest Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Try everything free for 14 days. No credit card required.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">Save 50%</Badge>
          </button>
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
                All programs, exercises, videos, and tracking tools
              </CardDescription>
              <div className="text-center mt-4">
                {billingPeriod === 'monthly' ? (
                  <>
                    <span className="text-4xl font-bold">$10</span>
                    <span className="text-muted-foreground">/month</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">$60</span>
                    <span className="text-muted-foreground">/year</span>
                    <p className="text-sm text-success mt-1">That's just $5/month</p>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>All workout programs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Full exercise library with video guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Workout logging & progress tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Streaks, points & gamification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Achievements & analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>All future programs & updates</span>
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe('app')}
                className="w-full"
                size="lg"
              >
                Start 14-Day Free Trial
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No credit card required to start
              </p>
            </CardContent>
          </Card>

          {/* 1-on-1 Coaching */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
            <Badge className="absolute top-4 right-4 bg-primary">Best Value</Badge>
            <CardHeader className="relative text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">1-on-1 Coaching</CardTitle>
              <CardDescription>
                Direct access to our trainers for accountability and personalized guidance
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
                  <span>Personalized program design</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Direct messaging with your coach</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Custom exercise modifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Lifestyle & ergonomic assessments</span>
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
              <p className="text-xs text-center text-muted-foreground">
                Includes full app access
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust */}
        <div className="flex flex-col items-center gap-4 mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 text-success">
            <Shield className="h-5 w-5" />
            <span className="font-medium">14-Day Free Trial on All Plans</span>
          </div>
          <p className="text-muted-foreground text-center max-w-md">
            Get full access to everything. If you love it, your subscription starts automatically. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

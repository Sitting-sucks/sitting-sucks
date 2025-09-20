import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, UserCheck, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/pricing');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">FitTracker</span>
          </div>
          <Button onClick={handleLogin} variant="outline">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Transform Your Health with the
            <span className="text-primary block">Anti-Sitting Daily Protocol</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Combat the effects of prolonged sitting with our evidence-based movement protocols. 
            Designed by experts to keep you healthy, mobile, and pain-free.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleGetStarted} size="lg" className="text-lg px-8">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={handleLogin} variant="outline" size="lg" className="text-lg px-8">
              I Have an Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose FitTracker?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to counteract the negative effects of sitting
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Evidence-Based Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Anti-Sitting Daily Protocol is backed by research and designed by movement experts to address the root causes of sitting-related health issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <UserCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Expert Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get personalized guidance from certified coaches with weekly check-ins and custom program design tailored to your needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Complete Exercise Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access hundreds of exercises with video demonstrations, equipment alternatives, and detailed instructions for every movement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Full App Access</CardTitle>
                <CardDescription>Complete movement protocols</CardDescription>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold">$30</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Complete Anti-Sitting Protocol</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Full exercise library</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Progress tracking</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-primary">
              <Badge className="absolute top-4 right-4 bg-primary">Most Popular</Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">1-on-1 Coaching</CardTitle>
                <CardDescription>Personalized expert guidance</CardDescription>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold">$200</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Everything in Full Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Weekly check-ins</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <span>Custom programs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button onClick={handleGetStarted} size="lg" className="text-lg px-12">
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FitTracker</span>
          </div>
          <p className="text-muted-foreground">
            Transform your health with evidence-based movement protocols
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
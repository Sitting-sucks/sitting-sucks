import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGateProps {
  children: ReactNode;
  feature: string;
  requiresPremium?: boolean;
}

export const SubscriptionGate = ({ children, feature, requiresPremium = true }: SubscriptionGateProps) => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/landing');
  };

  // For now, always show the subscription gate for premium features
  // TODO: Add proper subscription checking once billing is fully set up
  if (!requiresPremium) {
    return <>{children}</>;
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
      <CardHeader className="relative text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Crown className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          Unlock {feature} with FitTracker Premium
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Access to all workout videos and exercises</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Personalized workout plans</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Advanced progress tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm">Priority customer support</span>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleSubscribe}
            className="w-full"
            size="lg"
          >
            <Crown className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
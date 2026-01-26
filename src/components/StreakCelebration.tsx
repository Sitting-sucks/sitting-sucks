import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flame, Trophy, Sparkles, X } from 'lucide-react';

interface StreakCelebrationProps {
  data: {
    type: 'streak' | 'achievement' | 'pr';
    streak?: number;
    points?: number;
    achievement?: {
      name: string;
      description: string;
      tier: string;
    };
    pr?: {
      exercise: string;
      type: string;
      value: number;
    };
  };
  onClose: () => void;
}

const confettiColors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'];

export const StreakCelebration = ({ data, onClose }: StreakCelebrationProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.5,
    }));
    setConfetti(particles);

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '1';
    if (streak >= 30) return '2';
    if (streak >= 7) return '3';
    return '4';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return "LEGENDARY! You're unstoppable!";
    if (streak >= 30) return "A whole month of consistency!";
    if (streak >= 7) return "One week strong! Keep it up!";
    return "Great start! Keep the chain going!";
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${particle.x}%`,
                top: '100%',
                backgroundColor: particle.color,
                animationDelay: `${particle.delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="relative text-center py-8">
          {data.type === 'streak' && data.streak && (
            <>
              <div className="animate-bounce-in">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Flame className="h-14 w-14 text-white animate-streak-fire" />
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-4xl font-bold mb-2">
                  {data.streak} Day Streak!
                </h2>
                <p className="text-xl text-white/90 mb-4">
                  {getStreakMessage(data.streak)}
                </p>
              </div>

              {data.points && data.points > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-bold">+{data.points} bonus points!</span>
                  </div>
                </div>
              )}
            </>
          )}

          {data.type === 'achievement' && data.achievement && (
            <>
              <div className="animate-bounce-in">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Trophy className="h-14 w-14 text-white" />
                </div>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-sm uppercase tracking-wider text-white/80 mb-2">
                  Achievement Unlocked
                </p>
                <h2 className="text-3xl font-bold mb-2">
                  {data.achievement.name}
                </h2>
                <p className="text-white/90 mb-4">
                  {data.achievement.description}
                </p>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                    data.achievement.tier === 'platinum'
                      ? 'bg-purple-400/30 text-purple-100'
                      : data.achievement.tier === 'gold'
                      ? 'bg-yellow-400/30 text-yellow-100'
                      : data.achievement.tier === 'silver'
                      ? 'bg-gray-300/30 text-gray-100'
                      : 'bg-orange-400/30 text-orange-100'
                  }`}
                >
                  {data.achievement.tier.charAt(0).toUpperCase() + data.achievement.tier.slice(1)} Tier
                </span>
              </div>
            </>
          )}

          <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              Keep Going!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

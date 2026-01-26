import { Tables } from '@/integrations/supabase/types';
import { Award, Trophy, Star, Crown, Medal } from 'lucide-react';

interface AchievementCardProps {
  achievement: Tables<'user_achievements'>;
  compact?: boolean;
}

const tierColors = {
  bronze: 'from-orange-600 to-orange-400',
  silver: 'from-gray-400 to-gray-300',
  gold: 'from-yellow-500 to-yellow-300',
  platinum: 'from-purple-500 to-pink-400',
};

const tierBgColors = {
  bronze: 'bg-orange-500/10 border-orange-500/20',
  silver: 'bg-gray-400/10 border-gray-400/20',
  gold: 'bg-yellow-500/10 border-yellow-500/20',
  platinum: 'bg-purple-500/10 border-purple-500/20',
};

const tierIcons = {
  bronze: Medal,
  silver: Star,
  gold: Trophy,
  platinum: Crown,
};

export const AchievementCard = ({ achievement, compact = false }: AchievementCardProps) => {
  const tier = (achievement.tier || 'bronze') as keyof typeof tierColors;
  const TierIcon = tierIcons[tier];
  const bgColor = tierBgColors[tier];
  const gradientColor = tierColors[tier];

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${bgColor}`}>
        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
          <TierIcon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{achievement.achievement_name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {new Date(achievement.earned_at).toLocaleDateString()}
          </p>
        </div>
        {achievement.points_awarded > 0 && (
          <span className="text-xs font-medium text-muted-foreground">
            +{achievement.points_awarded} pts
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 ${bgColor}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <TierIcon className="w-full h-full" />
      </div>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <TierIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{achievement.achievement_name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${gradientColor} text-white`}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.achievement_description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Earned {new Date(achievement.earned_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {achievement.points_awarded > 0 && (
                <span className="font-medium text-primary">
                  +{achievement.points_awarded} points
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

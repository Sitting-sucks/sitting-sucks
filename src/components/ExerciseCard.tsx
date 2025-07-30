import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, FileText, Star } from "lucide-react";

interface ExerciseCardProps {
  name: string;
  description: string;
  equipment: string[];
  jointMovements: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  intensity: 1 | 2 | 3 | 4 | 5;
  hasVideo?: boolean;
  hasDocument?: boolean;
  duration?: string;
}

const ExerciseCard = ({ 
  name, 
  description, 
  equipment, 
  jointMovements, 
  difficulty, 
  intensity,
  hasVideo = false,
  hasDocument = false,
  duration
}: ExerciseCardProps) => {
  const getDifficultyColor = (level: number) => {
    const colors = {
      1: "bg-green-100 text-green-800",
      2: "bg-yellow-100 text-yellow-800", 
      3: "bg-orange-100 text-orange-800",
      4: "bg-red-100 text-red-800",
      5: "bg-red-200 text-red-900"
    };
    return colors[level as keyof typeof colors] || colors[3];
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
            {duration && (
              <p className="text-sm text-muted-foreground mt-1">Duration: {duration}</p>
            )}
          </div>
          <div className="flex space-x-2">
            {hasVideo && (
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4" />
              </Button>
            )}
            {hasDocument && (
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Equipment */}
          <div>
            <p className="text-sm font-medium mb-2">Equipment:</p>
            <div className="flex flex-wrap gap-1">
              {equipment.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Joint Movements */}
          <div>
            <p className="text-sm font-medium mb-2">Joint Movements:</p>
            <div className="flex flex-wrap gap-1">
              {jointMovements.map((movement, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {movement}
                </Badge>
              ))}
            </div>
          </div>

          {/* Difficulty & Intensity */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Difficulty:</p>
              <div className="flex items-center space-x-1">
                {renderStars(difficulty)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Intensity:</p>
              <div className="flex items-center space-x-1">
                {renderStars(intensity)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
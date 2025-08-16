import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { Play, FileText, Star, Target, Clock, Info } from "lucide-react";

interface ExerciseCardProps {
  name: string;
  description: string;
  instructions?: string;
  equipment: string[];
  jointMovements: string[];
  difficulty: number;
  intensity: number;
  hasVideo?: boolean;
  hasDocument?: boolean;
  duration?: string;
  videoUrl?: string;
  targetMuscles?: string[];
  baseline?: string;
  progression?: string;
  regression?: string;
  allowPreview?: boolean;
}

const ExerciseCard = ({ 
  name, 
  description,
  instructions,
  equipment, 
  jointMovements, 
  difficulty, 
  intensity,
  hasVideo = false,
  hasDocument = false,
  duration,
  videoUrl,
  targetMuscles = [],
  baseline,
  progression,
  regression,
  allowPreview = false
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
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {hasVideo && (
              <div className="p-1 rounded bg-primary/10">
                <Play className="h-3 w-3 text-primary" />
              </div>
            )}
            {hasDocument && (
              <div className="p-1 rounded bg-secondary/10">
                <FileText className="h-3 w-3 text-secondary" />
              </div>
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

          {/* Target Muscles */}
          {targetMuscles.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Target Muscles:
              </p>
              <div className="flex flex-wrap gap-1">
                {targetMuscles.map((muscle, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{name}</DialogTitle>
                <DialogDescription className="text-base">
                  {description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {instructions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {instructions}
                    </p>
                  </div>
                )}

                {hasVideo && videoUrl && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Video Tutorial</h3>
                    <div className="aspect-video">
                      <iframe
                        src={videoUrl}
                        title={`${name} exercise tutorial`}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Exercise Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Equipment:</span>
                        <div className="flex flex-wrap gap-1">
                          {equipment.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{duration}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <div className="flex items-center gap-1">
                          {renderStars(difficulty)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Intensity:</span>
                        <div className="flex items-center gap-1">
                          {renderStars(intensity)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Movement & Muscles</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-muted-foreground text-sm">Joint Movements:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {jointMovements.map((movement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {movement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {targetMuscles.length > 0 && (
                        <div>
                          <span className="text-muted-foreground text-sm">Target Muscles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {targetMuscles.map((muscle, index) => (
                              <Badge key={index} variant="default" className="text-xs">
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exercise Variations */}
                {(baseline || progression || regression) && (
                  <SubscriptionGate feature="exercise progressions and regressions" requiresPremium={!allowPreview}>
                    <div className="relative">
                      {allowPreview && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
                            Preview Mode
                          </Badge>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-3">Exercise Variations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {regression && (
                          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
                            <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Regression (Easier)</h4>
                            <p className="text-sm text-green-600 dark:text-green-300">{regression}</p>
                          </div>
                        )}
                        
                        {baseline && (
                          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/10">
                            <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Baseline (Standard)</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300">{baseline}</p>
                          </div>
                        )}
                        
                        {progression && (
                          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/10">
                            <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">Progression (Harder)</h4>
                            <p className="text-sm text-orange-600 dark:text-orange-300">{progression}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </SubscriptionGate>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
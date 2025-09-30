import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Target,
  Zap,
  Heart,
  Dumbbell,
  CheckCircle2
} from "lucide-react";

const Programs = () => {
  const programs = [
    {
      id: 1,
      title: "Anti-Sitting Daily Protocol",
      description: "Combat the effects of prolonged sitting with this essential daily routine",
      duration: "15 mins/day",
      level: "Beginner",
      frequency: "Daily",
      benefits: ["Improves posture", "Reduces back pain", "Increases mobility"],
      exercises: 8,
      featured: true
    },
    {
      id: 2,
      title: "Desk Worker Recovery",
      description: "Intensive program to reverse sitting damage and restore mobility",
      duration: "30 mins/day",
      level: "Intermediate",
      frequency: "5x per week",
      benefits: ["Full body mobility", "Pain relief", "Strength building"],
      exercises: 12,
      featured: false
    },
    {
      id: 3,
      title: "Morning Mobility Routine",
      description: "Start your day right with energizing stretches and movements",
      duration: "10 mins/day",
      level: "Beginner",
      frequency: "Daily",
      benefits: ["Boosts energy", "Improves flexibility", "Better focus"],
      exercises: 6,
      featured: false
    },
    {
      id: 4,
      title: "Hip Flexor Freedom",
      description: "Targeted program to unlock tight hips from excessive sitting",
      duration: "20 mins/day",
      level: "Intermediate",
      frequency: "4x per week",
      benefits: ["Hip mobility", "Lower back relief", "Better posture"],
      exercises: 10,
      featured: false
    },
    {
      id: 5,
      title: "Thoracic Spine Restoration",
      description: "Rebuild upper back mobility and reverse forward head posture",
      duration: "25 mins/day",
      level: "Advanced",
      frequency: "4x per week",
      benefits: ["Upper back mobility", "Shoulder health", "Neck pain relief"],
      exercises: 14,
      featured: false
    },
    {
      id: 6,
      title: "Complete Movement Reset",
      description: "Comprehensive program addressing all areas affected by sitting",
      duration: "45 mins/day",
      level: "Advanced",
      frequency: "5x per week",
      benefits: ["Total body mobility", "Strength & flexibility", "Pain elimination"],
      exercises: 20,
      featured: false
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Training Programs</h1>
            <p className="text-xl mb-8">Structured programs to combat sitting damage and restore your mobility</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Program */}
        {programs.filter(p => p.featured).map((program) => (
          <Card key={program.id} className="mb-8 border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="default" className="mb-2">Featured Program</Badge>
              </div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                {program.title}
              </CardTitle>
              <CardDescription className="text-base">
                {program.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">{program.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Level</p>
                    <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Frequency</p>
                    <p className="font-semibold">{program.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Exercises</p>
                    <p className="font-semibold">{program.exercises}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {program.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Program
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* All Programs Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.filter(p => !p.featured).map((program) => (
              <Card key={program.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{program.title}</span>
                    <Target className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{program.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Level</p>
                        <Badge className={getLevelColor(program.level)} variant="outline">
                          {program.level}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-semibold">{program.frequency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exercises</p>
                        <p className="font-semibold">{program.exercises}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {program.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      View Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Library, 
  ShoppingCart, 
  Target, 
  TrendingUp, 
  Clock,
  Zap,
  Award,
  Heart,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Anti-Sitting Daily Protocol data
  const antiSittingProtocol = {
    name: "Anti-Sitting Daily Protocol",
    description: "Essential mobility exercises to counteract sitting damage",
    keyExercises: [
      "Calf & Hamstring Stretch",
      "Hip Flexor Release", 
      "Thoracic Extension",
      "Glute Activation"
    ],
    benefits: [
      "Improves posture",
      "Reduces back pain", 
      "Increases energy",
      "Better circulation"
    ]
  };

  const weeklyProgress = {
    workoutsCompleted: 4,
    workoutsGoal: 5,
    minutesExercised: 180,
    streakDays: 12
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Back, Fighter!</h1>
            <p className="text-xl mb-8">Ready to combat the effects of sitting? Let's get moving!</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/exercise-library">
                <Button size="lg" variant="secondary" className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Start Exercises</span>
                </Button>
              </Link>
              <Link to="/store">
                <Button size="lg" variant="outline" className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-primary">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Get Equipment</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {weeklyProgress.workoutsCompleted}/{weeklyProgress.workoutsGoal}
              </div>
              <Progress 
                value={(weeklyProgress.workoutsCompleted / weeklyProgress.workoutsGoal) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                workouts completed this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Exercised</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{weeklyProgress.minutesExercised}</div>
              <p className="text-xs text-muted-foreground">minutes this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{weeklyProgress.streakDays}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link to="/landing">
                <Button className="w-full">
                  Subscribe
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Anti-Sitting Protocol & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Anti-Sitting Daily Protocol */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Anti-Sitting Daily Protocol</span>
              </CardTitle>
              <CardDescription>Essential exercises to combat sitting damage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-primary">{antiSittingProtocol.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {antiSittingProtocol.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Key Exercises:</p>
                  <div className="space-y-2">
                    {antiSittingProtocol.keyExercises.map((exercise, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span>{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Benefits:</p>
                  <div className="flex flex-wrap gap-2">
                    {antiSittingProtocol.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to="/exercise-library">
                  <Button className="w-full" size="lg">
                    Explore Exercises
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Everything you need at your fingertips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/exercise-library">
                  <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                    <Library className="h-6 w-6" />
                    <span>Exercise Library</span>
                  </Button>
                </Link>
                
                <Link to="/store">
                  <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                    <ShoppingCart className="h-6 w-6" />
                    <span>Equipment Store</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Target className="h-6 w-6" />
                  <span>Progress</span>
                </Button>
                
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Award className="h-6 w-6" />
                  <span>Achievements</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest workouts and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-accent/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Completed Hip Flexor Release Protocol</p>
                  <p className="text-sm text-muted-foreground">Yesterday • 15 minutes</p>
                </div>
                <Badge variant="secondary">+10 XP</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-accent/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">New equipment added: Foam Roller</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <Badge variant="outline">Equipment</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-accent/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Achieved 10-day streak!</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
                <Badge variant="default">Achievement</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
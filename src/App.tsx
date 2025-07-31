import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import DailyWorkout from "./pages/DailyWorkout";
import EquipmentStore from "./pages/EquipmentStore";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/exercise-library" element={<ExerciseLibrary />} />
                      <Route path="/daily-workout" element={<DailyWorkout />} />
                      <Route path="/store" element={<EquipmentStore />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TrainerRoute from "./components/TrainerRoute";
import Navigation from "./components/Navigation";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";

// Pages
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import EquipmentStore from "./pages/EquipmentStore";
import Pricing from "./pages/Pricing";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MyPrograms from "./pages/MyPrograms";
import LogWorkout from "./pages/LogWorkout";
import ProgressHistory from "./pages/ProgressHistory";
import ExerciseDiary from "./pages/ExerciseDiary";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";

// Admin Pages
import ExerciseManagement from "./pages/admin/ExerciseManagement";
import ProgramBuilder from "./pages/admin/ProgramBuilder";
import ClientManagement from "./pages/admin/ClientManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <div className="min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute skipOnboarding>
                    <Onboarding />
                  </ProtectedRoute>
                } />

                {/* Protected Routes - All Users */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/exercise-library" element={
                  <ProtectedRoute>
                    <Navigation />
                    <ExerciseLibrary />
                  </ProtectedRoute>
                } />
                <Route path="/store" element={
                  <ProtectedRoute>
                    <Navigation />
                    <EquipmentStore />
                  </ProtectedRoute>
                } />
                <Route path="/pricing" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Pricing />
                  </ProtectedRoute>
                } />
                <Route path="/exercise-diary" element={
                  <ProtectedRoute>
                    <Navigation />
                    <ExerciseDiary />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Messages />
                  </ProtectedRoute>
                } />

                {/* Client Routes - Subscribers */}
                <Route path="/my-programs" element={
                  <ProtectedRoute>
                    <Navigation />
                    <MyPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/log-workout" element={
                  <ProtectedRoute>
                    <Navigation />
                    <LogWorkout />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Navigation />
                    <ProgressHistory />
                  </ProtectedRoute>
                } />

                {/* Admin Routes - Trainers Only */}
                <Route path="/admin/exercises" element={
                  <TrainerRoute>
                    <Navigation />
                    <ExerciseManagement />
                  </TrainerRoute>
                } />
                <Route path="/admin/programs" element={
                  <TrainerRoute>
                    <Navigation />
                    <ProgramBuilder />
                  </TrainerRoute>
                } />
                <Route path="/admin/clients" element={
                  <TrainerRoute>
                    <Navigation />
                    <ClientManagement />
                  </TrainerRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

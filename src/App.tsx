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

// Pages — lazy-loaded so each route ships its own chunk
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExerciseLibrary = lazy(() => import("./pages/ExerciseLibrary"));
const EquipmentStore = lazy(() => import("./pages/EquipmentStore"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyPrograms = lazy(() => import("./pages/MyPrograms"));
const LogWorkout = lazy(() => import("./pages/LogWorkout"));
const ProgressHistory = lazy(() => import("./pages/ProgressHistory"));
const ExerciseDiary = lazy(() => import("./pages/ExerciseDiary"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Settings = lazy(() => import("./pages/Settings"));
const Messages = lazy(() => import("./pages/Messages"));
const Today = lazy(() => import("./pages/Today"));
const PainProtocols = lazy(() => import("./pages/PainProtocols"));
const PainProtocol = lazy(() => import("./pages/PainProtocol"));

// Admin Pages
const ExerciseManagement = lazy(() => import("./pages/admin/ExerciseManagement"));
const ProgramBuilder = lazy(() => import("./pages/admin/ProgramBuilder"));
const ClientManagement = lazy(() => import("./pages/admin/ClientManagement"));
const MyClients = lazy(() => import("./pages/admin/MyClients"));
const SessionRecap = lazy(() => import("./pages/admin/SessionRecap"));
const PrescribeExercises = lazy(() => import("./pages/admin/PrescribeExercises"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/pain-protocols" element={<PainProtocols />} />
                <Route path="/pain-protocols/:slug" element={<PainProtocol />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute skipOnboarding>
                    <Onboarding />
                  </ProtectedRoute>
                } />

                {/* Protected Routes - All Users */}
                <Route path="/dashboard" element={
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
                <Route path="/today" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Today />
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
                <Route path="/admin/my-clients" element={
                  <TrainerRoute>
                    <Navigation />
                    <MyClients />
                  </TrainerRoute>
                } />
                <Route path="/admin/session-recap" element={
                  <TrainerRoute>
                    <Navigation />
                    <SessionRecap />
                  </TrainerRoute>
                } />
                <Route path="/admin/prescribe" element={
                  <TrainerRoute>
                    <Navigation />
                    <PrescribeExercises />
                  </TrainerRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

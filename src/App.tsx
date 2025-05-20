import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./pages/ThemeProvider";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import TestHistoryPage from "./pages/TestHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";
import { TranslationProvider } from "./lib/TranslationProvider";
import { AuthProvider } from "./lib/sso/AuthContext";
import ProtectedRoute from "./lib/sso/ProtectedRoute";
import PublicRoute from "./lib/sso/PublicRoute";
import AuthCallback from "./pages/auth/sso/callback";
import { LogoutPage } from "./pages/auth/logout";
import LogoutCallback from "./pages/auth/sso/logout-callback";
import { ROUTES } from "./utils/constants";
import TestDetailsPage from "./pages/TestDetailsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rutas públicas (solo accesibles si NO está autenticado) */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path={ROUTES.LOGIN} 
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Rutas protegidas que requieren autenticación */}
                <Route 
                  path={ROUTES.DASHBOARD} 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={`${ROUTES.TEST}/:testType`} 
                  element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.RESULTS} 
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.RESULTS + "/:testId"} 
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tests/:testId" 
                  element={
                    <ProtectedRoute>
                      <TestDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.TESTS_HISTORY} 
                  element={
                    <ProtectedRoute>
                      <TestHistoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.PROFILE} 
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.PROFILE_SETTINGS} 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rutas especiales de autenticación */}
                <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
                <Route 
                  path={ROUTES.AUTH_LOGOUT} 
                  element={
                    <ProtectedRoute>
                      <LogoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path={ROUTES.AUTH_LOGOUT_CALLBACK} element={<LogoutCallback />} />
                
                {/* Ruta 404 */}
                <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

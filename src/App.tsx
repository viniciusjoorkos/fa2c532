import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/app/Home";
import Carteira from "./pages/app/Carteira";
import Agenda from "./pages/app/Agenda";
import Gravadas from "./pages/app/Gravadas";
import ChatPage from "./pages/app/ChatPage";
import Depoimentos from "./pages/app/Depoimentos";
import Perfil from "./pages/app/Perfil";
import Admin from "./pages/app/Admin";
import Premium from "./pages/app/Premium";
import Instrucoes from "./pages/app/Instrucoes";
import PublicProfile from "./pages/app/PublicProfile";
import Inbox from "./pages/app/Inbox";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" theme="dark" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/atualizar-senha" element={<ResetPassword />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="carteira" element={<Carteira />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="gravadas" element={<Gravadas />} />
              <Route path="premium" element={<Premium />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="instrucoes" element={<Instrucoes />} />
              <Route path="depoimentos" element={<Depoimentos />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="usuario/:id" element={<PublicProfile />} />
              <Route path="inbox" element={<Inbox />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import Index from './pages/Index'
import SearchPage from './pages/Search'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { AdminRoute } from '@/components/AdminRoute'
import { AdminLayout } from '@/components/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProfessionals from '@/pages/admin/AdminProfessionals'

const App = () => (
  <AuthProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/perfil/:id" element={<Profile />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/painel/perfil" element={<Dashboard />} />

            {/* Static Pages */}
            <Route path="/sobre-nos" element={<About />} />
            <Route path="/termos-de-uso" element={<Terms />} />
            <Route path="/politica-de-privacidade" element={<Privacy />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminProfessionals />} />
              {/* Future admin routes can be added here */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App

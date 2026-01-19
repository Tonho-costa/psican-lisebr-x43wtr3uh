import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import { AdminRoute } from './components/AdminRoute'

// Public Pages
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

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminProfiles from './pages/admin/AdminProfiles'
import AdminLogs from './pages/admin/AdminLogs'

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

          {/* Admin Login - Separated from Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes - Protected by AdminRoute Guard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="submissoes" element={<AdminSubmissions />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="perfis" element={<AdminProfiles />} />{' '}
            {/* Alias for compatibility */}
            <Route path="logs" element={<AdminLogs />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App

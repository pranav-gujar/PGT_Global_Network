import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useScrollToTop } from './hooks/useScrollToTop';
import { usePageLoading } from './hooks/usePageLoading';
import { supabase } from './lib/supabase';
import AnnouncementBar from './components/AnnouncementBar';
import AnimatedBackground from './components/AnimatedBackground';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Timeline from './pages/Timeline';
import Impact from './pages/Impact';
import Gallery from './pages/Gallery';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import ProgramDetail from './pages/ProgramDetail';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard';
import Apply from './pages/Apply';
import Ventures from './pages/Ventures';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages & Route Protection
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  useScrollToTop();
  const loading = usePageLoading();
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for recovery event callbacks
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const isAuthPage = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);
  
  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Skip to main content
      </a>
      {loading && <LoadingSpinner />}
      {!isAuthPage && <Navbar />}
      <main id="main-content" tabIndex={-1} className="outline-none">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/programs/:programId" element={<ProgramDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/ventures" element={<Ventures />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Auth routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/apply" element={<ProtectedRoute><Apply /></ProtectedRoute>} />

            {/* Error and fallback routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <ScrollToTop />}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }
        }}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AnimatedBackground />
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <AppContent />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
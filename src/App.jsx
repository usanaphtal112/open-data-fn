import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './services/resources/auth';

// Import Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Import pages
import RegistrationPage from './pages/Registration/RegistrationPage';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import Dashboard from './pages/Dashboard/Dashboard';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout for pages that need both Navbar and Footer
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

// Layout for authentication pages (no navbar/footer)
const AuthLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="auth-layout auth-layout-with-nav">
        {children}
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes with main layout */}
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              } 
            />
            <Route path="/dashboard"
            element = {
            <MainLayout>
            <Dashboard/>
            </MainLayout>
            }
            />
            <Route 
              path="/about" 
              element={
                <MainLayout>
                  <AboutPage />
                </MainLayout>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              } 
            />
            <Route 
              path="/register" 
              element={
                <AuthLayout>
                  <RegistrationPage />
                </AuthLayout>
              } 
            />
            
            {/* Protected routes with main layout */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>User Profile Page</div> {/* Replace with actual profile component */}
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
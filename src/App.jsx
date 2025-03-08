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
import RegistrationSuccessPage from './pages/Registration/RegistrationSuccessPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
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
          
          {/* Auth routes without navbar/footer */}
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
          <Route 
            path="/registration-success" 
            element={
              <AuthLayout>
                <RegistrationSuccessPage />
              </AuthLayout>
            } 
          />
          
          {/* Protected routes with main layout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Dashboard Page</div> {/* Replace with actual dashboard component */}
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
  );
}

export default App;
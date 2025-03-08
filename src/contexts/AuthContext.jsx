
import { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, logoutUser } from '../services/resources/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // Here you would typically fetch the user profile
        // For now, we'll just set a simple user object
        setUser({ authenticated: true });
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = (userData) => {
    setUser(userData);
  };
  
  const logout = () => {
    logoutUser();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
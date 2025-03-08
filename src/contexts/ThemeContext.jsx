// import React, { createContext, useState, useEffect, useContext } from 'react';

// // Create context
// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // Check if user has previously selected a theme
//   const getInitialTheme = () => {
//     const savedTheme = localStorage.getItem('theme');
    
//     // If user has a saved preference, use it
//     if (savedTheme) {
//       return savedTheme;
//     }
    
//     // Otherwise check for system preference
//     const userPrefersDark = window.matchMedia && 
//       window.matchMedia('(prefers-color-scheme: dark)').matches;
    
//     return userPrefersDark ? 'dark' : 'light';
//   };
  
//   const [theme, setTheme] = useState(getInitialTheme);
  
//   // Apply theme changes to document
//   useEffect(() => {
//     const root = document.documentElement;
    
//     // Remove previous theme class
//     root.classList.remove('light-mode', 'dark-mode');
    
//     // Add current theme class
//     root.classList.add(`${theme}-mode`);
    
//     // Save the theme preference
//     localStorage.setItem('theme', theme);
//   }, [theme]);
  
//   // Toggle between light and dark mode
//   const toggleTheme = () => {
//     setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
//   };
  
//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // Custom hook for using the theme
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
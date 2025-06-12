import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import your components
import Login from './components/Login';
import NavigationLayout from '../src/layouts/NavigationLayout';
import DashArticleListPage from './components/DashArticleListPage';
import ArticleListPage from './components/ArticleListPage'; // New public reading page
import UsersPage from './components/UsersPage';
import UserService from './services/UserService';
import './App.css';

// Global theme for the entire app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '16px',
          padding: '8px 16px',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const currentUser = UserService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/browse" replace />; // Redirect to browse instead of articles
  }
  
  return children;
};

function App() {
  const currentUser = UserService.getCurrentUser();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Login Route - No sidebar/navbar */}
          <Route 
            path="/login" 
            element={
              currentUser ? <Navigate to="/browse" replace /> : <Login />
            } 
          />
          
          {/* Routes with NavigationLayout (sidebar + app bar) */}
          <Route path="/" element={<NavigationLayout />}>
            {/* Default route - redirect to browse articles */}
            <Route index element={<Navigate to="/browse" replace />} />
            
            {/* Browse Articles page - accessible to all logged-in users (PUBLIC VIEW) */}
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor', 'user']}>
                  <ArticleListPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Manage Articles page - accessible to all logged-in users (MANAGEMENT VIEW) */}
            <Route 
              path="/articles" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor', 'user']}>
                  <DashArticleListPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Users page - only accessible to admins */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Catch-all route - redirect to login if not authenticated, browse if authenticated */}
          <Route 
            path="*" 
            element={
              currentUser ? <Navigate to="/browse" replace /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
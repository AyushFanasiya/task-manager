import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { initializeLocalStorage } from './utils/localStorage';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import './styles/index.css';

function App() {
  // Initialize localStorage with sample data
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin Dashboard */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Employee Dashboard */}
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Catch all other routes and redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
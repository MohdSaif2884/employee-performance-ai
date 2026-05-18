import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EmployeeRegistrationForm from './pages/EmployeeRegistrationForm.jsx';
import EmployeeListPage from './pages/EmployeeListPage.jsx';
import EmployeeEditForm from './pages/EmployeeEditForm.jsx';
import AIRecommendationPage from './pages/AIRecommendationPage.jsx';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/Toast.jsx';


function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/employees/new"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeRegistrationForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/employees"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeListPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/employees/:id/edit"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeeEditForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/ai"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AIRecommendationPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AnalyticsDashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}



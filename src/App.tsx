import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import ReadingClubDetail from "@/pages/ReadingClubDetail";
import CreateReadingClub from "@/pages/CreateReadingClub";
import Review from "@/pages/Review";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuthStore } from "@/store/useAuthStore";

function ProtectedRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: 'organizer' | 'member' }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-ochre-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reading-club/:id" element={<ReadingClubDetail />} />
        <Route path="/reading-club/:id/review" element={<Review />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute requireRole="organizer">
              <CreateReadingClub />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

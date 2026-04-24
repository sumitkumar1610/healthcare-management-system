import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // We render the Outlet directly so each role-specific dashboard 
  // (Patient, Doctor, Admin) can manage its own specific Sidebar layout.
  return (
    <div className="min-h-screen bg-gray-50/30 flex">
      <Outlet />
    </div>
  );
}

import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/Constants';
import { useAuth } from '@/hooks/UseAuth';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { useEffect } from 'react';

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  useEffect(() =>{
    console.log(isAuthenticated);
  }, [])


  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
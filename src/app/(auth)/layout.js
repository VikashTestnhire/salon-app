import { GuestRoute } from '@/components/auth/ProtectedRoute';

export default function AuthLayout({ children }) {
  return (
    <GuestRoute>
      {children}
    </GuestRoute>
  );
}

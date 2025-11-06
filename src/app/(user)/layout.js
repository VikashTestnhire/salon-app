import { UserRoute } from '@/components/auth/ProtectedRoute';

export default function UserLayout({ children }) {
  return (
    <UserRoute>
      {children}
    </UserRoute>
  );
}

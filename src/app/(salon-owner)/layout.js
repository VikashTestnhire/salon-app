import { SalonOwnerRoute } from '@/components/auth/ProtectedRoute';

export default function SalonOwnerLayout({ children }) {
  return (
    <SalonOwnerRoute>
      {children}
    </SalonOwnerRoute>
  );
}

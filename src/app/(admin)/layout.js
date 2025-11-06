import { AdminRoute } from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:pl-72">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}

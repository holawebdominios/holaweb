'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  checkingAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  checkingAdmin: true,
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Verificar si es admin
        setCheckingAdmin(true);
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch('/api/admin/check-admin', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          setIsAdmin(data.isAdmin || false);

          if (!data.isAdmin) {
            // No es admin, redirigir al login
            router.push('/admin/login?error=unauthorized');
          }
        } catch (error) {
          console.error('Error verificando admin:', error);
          setIsAdmin(false);
        } finally {
          setCheckingAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ user, loading, isAdmin, checkingAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  }
  return context;
}


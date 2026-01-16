'use client'
import { useAuth } from '../lib/auth-context';
import Sidebar from './Sidebar';
import { ToastProvider } from './ui/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    
    return (
        <ToastProvider>
            <Sidebar />
            <main className={`${isAuthenticated ? 'sm:ml-64' : ''} min-h-screen transition-all duration-300 p-4 sm:p-8`}>
                {children}
            </main>
        </ToastProvider>
    )
}

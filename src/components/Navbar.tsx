'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Menu, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    const handleLogout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            router.push('/login');
        } catch {
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    if (!user?.name) return null;

    const navLinks = user.role === 'ADMIN' ? [
        { label: 'Subjects', href: '/admin/dashboard' },
        { label: 'Results', href: '/admin/results' },
    ] : [
        { label: 'Quizzes', href: '/student/dashboard' },
        { label: 'My Results', href: '/student/results' },
    ];

    return (
        <nav className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="font-bold text-xl cursor-pointer text-primary" onClick={() => router.push('/')}>
                            QuizMaster
                        </div>
                        {/* Desktop Links */}
                        <div className="hidden md:flex gap-1">
                            {navLinks.map(link => (
                                <Button key={link.href} variant="ghost" onClick={() => router.push(link.href)}>
                                    {link.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop User Info & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border">
                            <User size={14} />
                            <span className="font-medium">{user.name}</span>
                            <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded uppercase tracking-wider">{user.role}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-2 border-t mt-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <Button 
                                    key={link.href} 
                                    variant="ghost" 
                                    className="justify-start w-full" 
                                    onClick={() => {
                                        router.push(link.href);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <div className="border-t my-2 pt-2">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 mb-2">
                                    <User size={14} />
                                    <span>{user.name} ({user.role})</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

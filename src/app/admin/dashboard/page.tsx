'use client';

import type { Subject } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useState,useEffect, useCallback } from 'react';
import { SubjectTable } from '@/features/admin/SubjectTable';
import { Card, CardTitle,CardHeader, CardContent } from '@/components/ui/card';

// Dynamically import the dialog to reduce initial bundle size
const CreateSubjectDialog = dynamic(() => import('@/features/admin/CreateSubjectDialog').then(mod => mod.CreateSubjectDialog), {
    loading: () => <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />,
    ssr: false
});

export default function AdminDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getAllSubjects();
            setSubjects(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch subjects');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleDeleteSubject = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subject? All associated quizzes will be lost.')) return;
        try {
            await adminApi.deleteSubject(id);
            toast.success('Subject deleted successfully');
            fetchSubjects();
        } catch {
            toast.error('Failed to delete subject');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage subjects and quizzes</p>
                    </div>
                    <CreateSubjectDialog onSuccess={fetchSubjects} />
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subjects</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            {isLoading ? (
                                <div className="space-y-4 p-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
                                    ))}
                                </div>
                            ) : (
                                <SubjectTable subjects={subjects} onDelete={handleDeleteSubject} />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

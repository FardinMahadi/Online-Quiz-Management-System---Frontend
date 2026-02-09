'use client';

import type { Result } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import { studentApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardTitle,CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';

// Badge is not installed yet, I'll use a simple div if badge fails or install it.
// Actually, I'll just use a styled div for now to avoid another install step if not strictly needed.

export default function StudentResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const res = await studentApi.getMyResults(user.id);
                setResults(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Failed to fetch results');
                } else {
                    toast.error('An unexpected error occurred');
                }
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Results</h1>
                        <p className="text-gray-600">Track your performance across all quizzes</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attempt History</CardTitle>
                    </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Quiz Title</TableHead>
                                            <TableHead className="hidden sm:table-cell">Score</TableHead>
                                            <TableHead>Percentage</TableHead>
                                            <TableHead className="hidden md:table-cell">Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => {
                                            const percentage = (result.score / result.totalMarks) * 100;
                                            return (
                                                <TableRow key={result.id}>
                                                    <TableCell className="font-medium">{result.quizTitle}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{result.score} / {result.totalMarks}</TableCell>
                                                    <TableCell>{percentage.toFixed(1)}%</TableCell>
                                                    <TableCell className="hidden md:table-cell">{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <div className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${percentage >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {percentage >= 40 ? 'PASSED' : 'FAILED'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="ghost" onClick={() => router.push(`/student/results/${result.id}`)}>
                                                            View Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {results.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    You haven&apos;t taken any quizzes yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                </Card>
            </main>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { adminApi, Result } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function AdminResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await adminApi.getAllResults();
                setResults(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Failed to fetch all results');
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Quiz Results</h1>
                    <p className="text-gray-600">Monitor student performance across all quizzes</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Student Attempts</CardTitle>
                    </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Quiz Title</TableHead>
                                            <TableHead className="hidden sm:table-cell">Score</TableHead>
                                            <TableHead>Percentage</TableHead>
                                            <TableHead className="hidden md:table-cell">Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => {
                                            const percentage = (result.score / result.totalMarks) * 100;
                                            return (
                                                <TableRow key={result.id}>
                                                    <TableCell className="font-medium">{result.studentName}</TableCell>
                                                    <TableCell>{result.quizTitle}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{result.score} / {result.totalMarks}</TableCell>
                                                    <TableCell>{percentage.toFixed(1)}%</TableCell>
                                                    <TableCell className="hidden md:table-cell">{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
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
                                                    No quiz submissions found.
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

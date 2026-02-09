'use client';

import type { Result } from '@/types';

import { studentApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Award,XCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardTitle,CardHeader, CardContent } from '@/components/ui/card';

export default function ResultDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await studentApi.getResultDetails(Number(id));
                setResult(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDetails();
    }, [id]);

    if (!result) return <div className="flex items-center justify-center min-h-screen">Loading results...</div>;

    const percentage = (result.score / result.totalMarks) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button variant="ghost" className="mb-6" onClick={() => router.push('/student/results')}>
                    <ChevronLeft className="mr-2" size={16} /> Back to My Results
                </Button>

                <div className="grid gap-6">
                    <Card className="border-t-4 border-t-primary">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Award className="text-primary" size={32} />
                            </div>
                            <CardTitle className="text-3xl font-bold">{result.quizTitle}</CardTitle>
                            <p className="text-gray-500">Completed on {new Date(result.submittedAt).toLocaleDateString()}</p>
                        </CardHeader>
                        <CardContent className="text-center pb-8 border-b">
                            <div className="text-5xl font-extrabold text-primary mb-2">
                                {result.score} <span className="text-2xl text-gray-400">/ {result.totalMarks}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-bold ${percentage >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {percentage >= 40 ? 'PASSED' : 'FAILED'} ({percentage.toFixed(1)}%)
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-xl font-bold mt-4">Detailed Review</h2>
                    {result.answers ? (
                        <div className="space-y-4">
                            {result.answers.map((ans, idx) => (
                                <Card key={idx} className={ans.isCorrect ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div className="font-medium">
                                                <span className="text-gray-400 mr-2">Q{idx + 1}.</span>
                                                {ans.questionText}
                                            </div>
                                            {ans.isCorrect ? (
                                                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                                            ) : (
                                                <XCircle className="text-red-500 shrink-0" size={20} />
                                            )}
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div className={`p-3 rounded-md ${ans.isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Your Answer</p>
                                                <p className={ans.isCorrect ? 'text-green-700' : 'text-red-700'}>{ans.selectedOption}</p>
                                            </div>
                                            {!ans.isCorrect && (
                                                <div className="p-3 rounded-md bg-green-50 border border-green-100">
                                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Correct Answer</p>
                                                    <p className="text-green-700">{ans.correctOption}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500 italic">
                                Detailed answer breakdown is not available for this session.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

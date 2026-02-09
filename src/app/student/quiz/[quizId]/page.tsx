'use client';

import type { Quiz, QuizSubmission } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import { studentApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { useParams, useRouter } from 'next/navigation';
import { useState,useEffect, useCallback } from 'react';
import { QuestionCard } from '@/features/quiz/QuestionCard';
import { Send, Timer,ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuizPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const submission: QuizSubmission = {
                quizId: Number(quizId),
                answers: Object.entries(answers).map(([qId, val]) => ({
                    questionId: Number(qId),
                    selectedAnswer: val
                }))
            };
            const res = await studentApi.submitQuiz(Number(quizId), user.id, submission);
            toast.success(`Quiz submitted! Scored: ${res.data.score}/${res.data.totalMarks}`);
            router.push('/student/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to submit quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, quizId, answers, router]);

    const { formattedTime, isCritical } = useQuizTimer(quiz?.durationMinutes || 0, handleSubmit);

    const fetchQuiz = useCallback(async () => {
        try {
            const res = await studentApi.startQuiz(Number(quizId));
            setQuiz(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to start quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
            router.push('/student/dashboard');
        }
    }, [quizId, router]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    const handleAnswerChange = (qId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    if (!quiz) return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;

    const currentQuestion = quiz.questions?.[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{quiz.title}</h1>
                            <p className="text-gray-600">Question {currentQuestionIdx + 1} of {quiz.questions?.length}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start gap-4 px-4 py-2 bg-white border rounded-lg font-mono text-xl shadow-sm">
                            <span className="text-sm font-sans font-medium text-gray-500 sm:hidden">Time Left:</span>
                            <div className="flex items-center gap-2">
                                <Timer className={isCritical ? 'text-red-500 animate-pulse' : ''} />
                                {formattedTime}
                            </div>
                        </div>
                    </div>

                    {currentQuestion && (
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <QuestionCard 
                                question={currentQuestion}
                                selectedAnswer={answers[currentQuestion.id] || ''}
                                onAnswerChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                            />
                            <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
                                <Button 
                                    variant="outline" 
                                    disabled={currentQuestionIdx === 0}
                                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                                >
                                    <ChevronLeft size={16} className="mr-2" /> Previous
                                </Button>
                                {currentQuestionIdx < (quiz.questions?.length || 0) - 1 ? (
                                    <Button onClick={() => setCurrentQuestionIdx(prev => prev + 1)}>
                                        Next <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={isSubmitting}>
                                        <Send size={16} className="mr-2" />
                                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                    </Button>
                                )}
                            </CardFooter>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-6">
                        {quiz.questions?.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIdx(idx)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center transition-all
                                    ${currentQuestionIdx === idx ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2' : 
                                      answers[q.id] ? 'bg-green-100 text-green-700 border-green-200 border' : 'bg-white border text-gray-400 hover:border-gray-300'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

 

import type { Question } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState,useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Plus,Trash2, ChevronLeft } from 'lucide-react';
import { Dialog, DialogTitle, DialogFooter,DialogHeader, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function AdminQuestionsPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ 
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: '', 
        marks: 5,
        quizId: Number(quizId)
    });

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await adminApi.getQuestionsByQuiz(Number(quizId));
            setQuestions(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch questions');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, [quizId]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAddQuestion = async () => {
        if (!newQuestion.correctAnswer || newQuestion.options.some(o => !o)) {
            toast.error('Please fill all options and select a correct answer');
            return;
        }
        try {
            await adminApi.addQuestion(Number(quizId), newQuestion);
            toast.success('Question added successfully');
            setIsDialogOpen(false);
            setNewQuestion({ 
                text: '', 
                options: ['', '', '', ''], 
                correctAnswer: '', 
                marks: 5,
                quizId: Number(quizId)
            });
            fetchQuestions();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to add question');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await adminApi.deleteQuestion(id);
            toast.success('Question deleted successfully');
            fetchQuestions();
        } catch {
            toast.error('Failed to delete question');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft />
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Questions</h1>
                            <p className="text-gray-600">Add or remove questions from this quiz</p>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus size={16} className="mr-2" /> Add Question</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Question</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Question Text</Label>
                                        <Input 
                                            value={newQuestion.text} 
                                            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} 
                                            placeholder="Enter question text"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {newQuestion.options.map((opt, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <Label>Option {idx + 1}</Label>
                                                <Input 
                                                    value={opt} 
                                                    onChange={e => {
                                                        const newOpts = [...newQuestion.options];
                                                        newOpts[idx] = e.target.value;
                                                        setNewQuestion({...newQuestion, options: newOpts});
                                                    }} 
                                                    placeholder={`Option ${idx + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Correct Answer</Label>
                                            <select 
                                                className="w-full border rounded-md p-2 h-10"
                                                value={newQuestion.correctAnswer}
                                                onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                            >
                                                <option value="">Select Correct Option</option>
                                                {newQuestion.options.filter(o => o).map(o => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Marks</Label>
                                            <Input 
                                                type="number"
                                                value={newQuestion.marks} 
                                                onChange={e => setNewQuestion({...newQuestion, marks: Number(e.target.value)})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddQuestion}>Add Question</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <Card key={q.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start font-semibold mb-4">
                                    <div className="flex-1 mr-4">
                                        <span className="text-gray-400 mr-2">Q{idx + 1}.</span>
                                        {q.text}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-primary whitespace-nowrap">{q.marks} Marks</span>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Edit size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDeleteQuestion(q.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {q.options.map((opt) => (
                                        <div key={opt} className={`p-3 rounded-md border text-sm sm:text-base ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-medium' : 'bg-gray-50'}`}>
                                            <span className="mr-2 opacity-50">•</span>
                                            {opt} {opt === q.correctAnswer && <span className="ml-1 text-[10px] font-bold uppercase tracking-wider">(Correct)</span>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {questions.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                No questions added yet.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

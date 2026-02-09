'use client';

 

import type { Quiz } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState,useEffect, useCallback } from 'react';
import { Edit, Plus,Trash2, ListTodo, ChevronLeft } from 'lucide-react';
import { Card, CardTitle,CardHeader, CardContent } from '@/components/ui/card';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';
import { Dialog, DialogTitle, DialogFooter,DialogHeader, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function AdminQuizzesPage() {
    const { subjectId } = useParams();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ 
        title: '', 
        description: '', 
        durationMinutes: 30, 
        totalMarks: 100,
        subjectId: Number(subjectId)
    });

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await adminApi.getQuizzesBySubject(Number(subjectId));
            setQuizzes(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch quizzes');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, [subjectId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleCreateQuiz = async () => {
        try {
            await adminApi.createQuiz(newQuiz);
            toast.success('Quiz created successfully');
            setIsDialogOpen(false);
            setNewQuiz({ ...newQuiz, title: '', description: '' });
            fetchQuizzes();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteQuiz = async (id: number) => {
        if (!confirm('Are you sure you want to delete this quiz?')) return;
        try {
            await adminApi.deleteQuiz(id);
            toast.success('Quiz deleted successfully');
            fetchQuizzes();
        } catch {
            toast.error('Failed to delete quiz');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
                            <ChevronLeft />
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Quizzes</h1>
                            <p className="text-gray-600">Create and manage quizzes for this subject</p>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus size={16} className="mr-2" /> Add Quiz</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Quiz</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Quiz Title</Label>
                                        <Input 
                                            value={newQuiz.title} 
                                            onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} 
                                            placeholder="e.g. Midterm Exam"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input 
                                            value={newQuiz.description} 
                                            onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Duration (Min)</Label>
                                            <Input 
                                                type="number"
                                                value={newQuiz.durationMinutes} 
                                                onChange={e => setNewQuiz({...newQuiz, durationMinutes: Number(e.target.value)})} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Marks</Label>
                                            <Input 
                                                type="number"
                                                value={newQuiz.totalMarks} 
                                                onChange={e => setNewQuiz({...newQuiz, totalMarks: Number(e.target.value)})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateQuiz}>Create Quiz</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Quizzes</CardTitle>
                    </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="hidden sm:table-cell">Duration</TableHead>
                                            <TableHead className="hidden md:table-cell">Total Marks</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quizzes.map((quiz) => (
                                            <TableRow key={quiz.id}>
                                                <TableCell className="font-medium">{quiz.title}</TableCell>
                                                <TableCell className="hidden sm:table-cell">{quiz.durationMinutes} mins</TableCell>
                                                <TableCell className="hidden md:table-cell">{quiz.totalMarks}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/quizzes/${quiz.id}/questions`)}>
                                                            <ListTodo size={16} className="sm:mr-2" />
                                                            <span className="hidden sm:inline">Questions</span>
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleDeleteQuiz(quiz.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {quizzes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    No quizzes found. Create your first quiz.
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

'use client';

/* eslint-disable no-use-before-define */

import { useEffect, useState, useCallback } from 'react';
import { adminApi, Subject } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const fetchSubjects = useCallback(async () => {
        try {
            const res = await adminApi.getAllSubjects();
            setSubjects(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch subjects');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleCreateSubject = async () => {
        try {
            await adminApi.createSubject(newSubject);
            toast.success('Subject created successfully');
            setIsDialogOpen(false);
            setNewSubject({ name: '', code: '', description: '' });
            fetchSubjects();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create subject');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    const handleDeleteSubject = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subject? All associated quizzes will be lost.')) return;
        try {
            await adminApi.deleteSubject(id);
            toast.success('Subject deleted successfully');
            fetchSubjects();
        } catch (error) {
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus size={16} className="mr-2" /> Add Subject</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Subject</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Subject Name</Label>
                                    <Input 
                                        value={newSubject.name} 
                                        onChange={e => setNewSubject({...newSubject, name: e.target.value})} 
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject Code</Label>
                                    <Input 
                                        value={newSubject.code} 
                                        onChange={e => setNewSubject({...newSubject, code: e.target.value})} 
                                        placeholder="e.g. MATH101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input 
                                        value={newSubject.description} 
                                        onChange={e => setNewSubject({...newSubject, description: e.target.value})} 
                                        placeholder="Brief description"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateSubject}>Create Subject</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subjects</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Code</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden md:table-cell">Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subjects.map((subject) => (
                                            <TableRow key={subject.id}>
                                                <TableCell className="font-medium">{subject.code}</TableCell>
                                                <TableCell>{subject.name}</TableCell>
                                                <TableCell className="hidden md:table-cell">{subject.description}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/subjects/${subject.id}/quizzes`)}>
                                                            <BookOpen size={16} className="sm:mr-2" />
                                                            <span className="hidden sm:inline">Quizzes</span>
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => handleDeleteSubject(subject.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {subjects.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    No subjects found. Create your first subject to get started.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

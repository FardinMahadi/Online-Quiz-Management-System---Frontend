'use client';

import type { Subject } from '@/types';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';

interface SubjectTableProps {
    subjects: Subject[];
    onDelete: (id: number) => void;
}

export function SubjectTable({ subjects, onDelete }: SubjectTableProps) {
    const router = useRouter();

    return (
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
                                    <Button size="sm" variant="outline" onClick={() => onDelete(subject.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
    );
}

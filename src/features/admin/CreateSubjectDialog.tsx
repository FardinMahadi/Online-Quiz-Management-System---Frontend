'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogFooter,DialogHeader, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface CreateSubjectDialogProps {
    onSuccess: () => void;
}

export function CreateSubjectDialog({ onSuccess }: CreateSubjectDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateSubject = async () => {
        if (!newSubject.name || !newSubject.code) {
            toast.error('Name and Code are required');
            return;
        }

        setIsLoading(true);
        try {
            await adminApi.createSubject(newSubject);
            toast.success('Subject created successfully');
            setIsOpen(false);
            setNewSubject({ name: '', code: '', description: '' });
            onSuccess();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create subject');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    <Button onClick={handleCreateSubject} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Subject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

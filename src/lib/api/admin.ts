import type { Quiz, Result, Subject,Question } from '@/types';

import api from '../api';

export const adminApi = {
    // Subjects
    createSubject: (data: Partial<Subject>) => api.post<Subject>('/admin/subjects', data),
    getAllSubjects: () => api.get<Subject[]>('/admin/subjects'),
    updateSubject: (id: number, data: Partial<Subject>) => api.put<Subject>(`/admin/subjects/${id}`, data),
    deleteSubject: (id: number) => api.delete(`/admin/subjects/${id}`),
    
    // Quizzes
    createQuiz: (data: Partial<Quiz>) => api.post<Quiz>('/admin/quizzes', data),
    getQuizzesBySubject: (subjectId: number) => api.get<Quiz[]>(`/admin/quizzes/${subjectId}`),
    updateQuiz: (id: number, data: Partial<Quiz>) => api.put<Quiz>(`/admin/quizzes/${id}`, data),
    deleteQuiz: (id: number) => api.delete(`/admin/quizzes/${id}`),
    
    // Questions
    addQuestion: (quizId: number, data: Partial<Question>) => api.post<Question>(`/admin/quizzes/${quizId}/questions`, data),
    getQuestionsByQuiz: (quizId: number) => api.get<Question[]>(`/admin/quizzes/${quizId}/questions`),
    updateQuestion: (id: number, data: Partial<Question>) => api.put<Question>(`/admin/questions/${id}`, data),
    deleteQuestion: (id: number) => api.delete(`/admin/questions/${id}`),
    
    // Results
    getAllResults: () => api.get<Result[]>('/admin/results'),
    getResultsByQuiz: (quizId: number) => api.get<Result[]>(`/admin/results/quiz/${quizId}`),
};

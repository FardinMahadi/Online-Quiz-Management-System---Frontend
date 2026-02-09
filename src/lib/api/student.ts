import type { Quiz, Result,Subject, QuizSubmission } from '@/types';

import api from '../api';

export const studentApi = {
    getAllSubjects: () => api.get<Subject[]>('/student/subjects'),
    getAvailableQuizzes: (subjectId: number) => api.get<Quiz[]>(`/student/quizzes/${subjectId}`),
    startQuiz: (quizId: number) => api.get<Quiz>(`/student/quiz/${quizId}`),
    submitQuiz: (quizId: number, studentId: number, submission: QuizSubmission) => 
        api.post(`/student/quiz/${quizId}/submit`, submission, { params: { studentId } }),
    getMyResults: (studentId: number) => api.get<Result[]>('/student/results', { params: { studentId } }),
    getResultDetails: (resultId: number) => api.get<Result>(`/student/results/${resultId}`),
};

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
}

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer?: string;
    marks: number;
    quizId: number;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    totalMarks: number;
    durationMinutes: number;
    isActive: boolean;
    subjectId: number;
    subjectName?: string;
    questions?: Question[];
}

export interface Result {
    id: number;
    studentName: string;
    quizTitle: string;
    score: number;
    totalMarks: number;
    submittedAt: string;
    answers?: {
        questionText: string;
        selectedOption: string;
        correctOption: string;
        isCorrect: boolean;
        marksEarned: number;
    }[];
}

export interface QuizSubmission {
    quizId: number;
    answers: {
        questionId: number;
        selectedAnswer: string;
    }[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

'use client';

import type { Question } from '@/types';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardTitle,CardHeader, CardContent } from '@/components/ui/card';

interface QuestionCardProps {
    question: Question;
    selectedAnswer: string;
    onAnswerChange: (value: string) => void;
}

export function QuestionCard({ question, selectedAnswer, onAnswerChange }: QuestionCardProps) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                    {question.text}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup 
                    value={selectedAnswer} 
                    onValueChange={onAnswerChange}
                    className="space-y-4"
                >
                    {question.options.map((opt) => (
                        <div key={opt} className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-gray-50 ${selectedAnswer === opt ? 'border-primary bg-primary/5' : ''}`}>
                            <RadioGroupItem value={opt} id={`opt-${opt}`} />
                            <Label htmlFor={`opt-${opt}`} className="flex-1 cursor-pointer text-base">
                                {opt}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

'use client';

import { useState,useEffect, useCallback } from 'react';

export function useQuizTimer(initialMinutes: number, onTimeUp: () => void) {
    const [timeLeft, setTimeLeft] = useState<number | null>(initialMinutes * 60);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            onTimeUp();
        }
        
        if (timeLeft === null || timeLeft === 0) {
            return () => {};
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    return {
        timeLeft,
        formattedTime: timeLeft !== null ? formatTime(timeLeft) : '--:--',
        isCritical: timeLeft !== null && timeLeft < 60
    };
}

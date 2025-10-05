import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TARGET_BPM_MIN = 100;
const TARGET_BPM_MAX = 120;
const DURATION_SECONDS = 120; // 2 minutes

export default function CprTrainer({ onComplete }) {
    const [bpm, setBpm] = useState(0);
    const [feedback, setFeedback] = useState('Tap Start');
    const [isActive, setIsActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(DURATION_SECONDS);
    const [isFinished, setIsFinished] = useState(false);
    
    const clicksRef = useRef([]);
    const goodTimeRef = useRef(0); // Time spent in the good range
    const intervalRef = useRef(null);
    const timerIntervalRef = useRef(null);

    const calculateBpm = useCallback(() => {
        const now = Date.now();
        const fiveSecondsAgo = now - 5000;
        clicksRef.current = clicksRef.current.filter(t => t > fiveSecondsAgo);
        
        if (clicksRef.current.length > 1) {
            const currentBpm = (clicksRef.current.length / 5) * 60;
            setBpm(Math.round(currentBpm));
        } else {
            setBpm(0);
        }
    }, []);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(calculateBpm, 500);
            timerIntervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        clearInterval(intervalRef.current);
                        setIsActive(false);
                        setIsFinished(true);
                        const score = (goodTimeRef.current / DURATION_SECONDS) * 100;
                        onComplete(Math.round(score));
                        return 0;
                    }
                    if (bpm >= TARGET_BPM_MIN && bpm <= TARGET_BPM_MAX) {
                        goodTimeRef.current += 1;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(timerIntervalRef.current);
        };
    }, [isActive, calculateBpm, onComplete, bpm]);

    useEffect(() => {
        if (!isActive) return;
        if (bpm === 0 && clicksRef.current.length > 0) {
             setFeedback('Keep Going...');
        } else if (bpm === 0) {
            setFeedback('Start Compressions');
        } else if (bpm < TARGET_BPM_MIN) {
            setFeedback('Too Slow');
        } else if (bpm > TARGET_BPM_MAX) {
            setFeedback('Too Fast');
        } else {
            setFeedback('Good Pace');
        }
    }, [bpm, isActive]);

    const handleCompression = () => {
        if (!isActive || isFinished) return;
        clicksRef.current.push(Date.now());
        calculateBpm(); // Immediate feedback on click
    };
    
    const handleStart = () => {
        setIsActive(true);
        setIsFinished(false);
        setTimeRemaining(DURATION_SECONDS);
        setBpm(0);
        clicksRef.current = [];
        goodTimeRef.current = 0;
    };
    
    const handlePause = () => {
        setIsActive(false);
        setFeedback('Paused');
    };

    const handleReset = () => {
        setIsActive(false);
        setIsFinished(false);
        setTimeRemaining(DURATION_SECONDS);
        setBpm(0);
        setFeedback('Tap Start');
        clicksRef.current = [];
        goodTimeRef.current = 0;
    };

    const progressPercentage = ( (DURATION_SECONDS - timeRemaining) / DURATION_SECONDS ) * 100;
    const feedbackColor = 
        feedback === 'Good Pace' ? 'text-green-500' :
        feedback === 'Tap Start' || feedback === 'Paused' ? 'text-gray-500' :
        'text-red-500';

    if (isFinished) {
        return (
            <Card className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Training Complete!</h3>
                <p className="text-gray-600 mb-4">You maintained a good pace for {Math.round((goodTimeRef.current / DURATION_SECONDS) * 100)}% of the time.</p>
                <Button onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2"/>
                    Practice Again
                </Button>
            </Card>
        );
    }
    
    return (
        <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">CPR Compression Trainer</h3>
            <p className="text-gray-500 mb-4">Maintain a pace of 100-120 BPM for 2 minutes.</p>
            
            <motion.div
                onClick={handleCompression}
                whileTap={{ scale: 0.9 }}
                className="w-48 h-48 mx-auto my-6 bg-red-100 rounded-full flex items-center justify-center cursor-pointer select-none"
            >
                <Heart className={`w-24 h-24 text-red-500 transition-transform duration-75 ${isActive ? 'animate-pulse' : ''}`} />
            </motion.div>

            <div className={`text-4xl font-bold mb-2 transition-colors ${feedbackColor}`}>{isActive ? `${bpm} BPM` : 'Paused'}</div>
            <div className={`text-lg font-semibold mb-6 transition-colors ${feedbackColor}`}>{feedback}</div>
            
            <Progress value={progressPercentage} className="mb-4 h-3" />
            <div className="flex justify-between text-sm text-gray-600 mb-6">
                <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                <span>2:00</span>
            </div>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4"/></Button>
                {!isActive ? (
                    <Button onClick={handleStart} className="w-32 bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" /> Start
                    </Button>
                ) : (
                    <Button onClick={handlePause} className="w-32 bg-amber-600 hover:bg-amber-700">
                        <Pause className="w-4 h-4 mr-2" /> Pause
                    </Button>
                )}
            </div>
        </Card>
    );
}
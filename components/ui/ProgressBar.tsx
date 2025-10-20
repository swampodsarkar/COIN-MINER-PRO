import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    color: string;
    label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color, label }) => {
    const percentage = Math.max(0, (value / max) * 100);
    return (
        <div>
            {label && <span className="text-sm font-bold text-white mb-1 block">{label}</span>}
            <div className="w-full bg-gray-900 rounded-full h-5 border-2 border-black relative overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs drop-shadow-md">{Math.round(value)} / {max}</span>
                </div>
            </div>
        </div>
    );
};

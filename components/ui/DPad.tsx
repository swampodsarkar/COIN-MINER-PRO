import React from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface DPadProps {
    onDirectionPress: (direction: Direction) => void;
    disabled?: boolean;
}

const DPad: React.FC<DPadProps> = ({ onDirectionPress, disabled = false }) => {
    
    const commonButtonClasses = "absolute w-12 h-12 bg-gray-800/70 rounded-md text-white text-2xl flex items-center justify-center border-2 border-gray-600 transition-transform active:scale-90 disabled:opacity-50";

    return (
        <div className="absolute bottom-6 left-6 w-36 h-36">
            <div className="relative w-full h-full">
                <button 
                    onClick={() => onDirectionPress('up')}
                    disabled={disabled}
                    className={`${commonButtonClasses} top-0 left-1/2 -translate-x-1/2`}
                    aria-label="Move Up"
                >
                    ▲
                </button>
                <button 
                    onClick={() => onDirectionPress('down')}
                    disabled={disabled}
                    className={`${commonButtonClasses} bottom-0 left-1/2 -translate-x-1/2`}
                    aria-label="Move Down"
                >
                    ▼
                </button>
                <button 
                    onClick={() => onDirectionPress('left')}
                    disabled={disabled}
                    className={`${commonButtonClasses} left-0 top-1/2 -translate-y-1/2`}
                    aria-label="Move Left"
                >
                    ◀
                </button>
                <button 
                    onClick={() => onDirectionPress('right')}
                    disabled={disabled}
                    className={`${commonButtonClasses} right-0 top-1/2 -translate-y-1/2`}
                    aria-label="Move Right"
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default DPad;

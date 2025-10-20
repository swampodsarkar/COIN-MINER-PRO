
import React, { ReactNode } from 'react';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-2xl border-2 border-orange-500">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl text-orange-400 font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-1 sm:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;


import React, { useState } from 'react';
import { Player, SystemData } from '../../types';
import { AXES } from '../../gameConfig';

interface MinerProps {
    player: Player;
    onMine: (amount: number) => void;
    system: SystemData | null;
    effectiveMiningPower: number;
}

interface FloatingNumber {
    id: number;
    value: string;
    x: number;
    y: number;
}

interface Particle {
  id: number;
  x: string;
  y: string;
  rotation: number;
  size: number;
}

const Miner: React.FC<MinerProps> = ({ player, onMine, system, effectiveMiningPower }) => {
    const [isMining, setIsMining] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    const getPickaxeDetails = () => {
        const equippedAxe = AXES[player.equipment.equippedAxe];
        if (!equippedAxe) return { emoji: '👊', name: 'Fists', nameColor: '#9ca3af' };

        let nameColor = '#9ca3af'; // Default
        if (equippedAxe.type === 'rare') nameColor = '#a78bfa'; // Purple for rare
        else if (effectiveMiningPower >= 10) nameColor = '#facc15';
        else if (effectiveMiningPower >= 5) nameColor = '#e5e7eb'; 

        return { emoji: equippedAxe.emoji, name: equippedAxe.name, nameColor };
    };

    const handleMineClick = () => {
        if (isMining) return;
        
        setIsMining(true);

        const rushMultiplier = (system?.events.goldenRush && system.events.goldenRushEnds > Date.now()) ? 2 : 1;
        const goldGained = effectiveMiningPower * rushMultiplier;
        onMine(goldGained);
        
        const newFloatingNumber: FloatingNumber = {
            id: Date.now(),
            value: `+${goldGained}`,
            x: 50 + Math.random() * 40 - 20,
            y: 50 + Math.random() * 20 - 10,
        };

        setFloatingNumbers(prev => [...prev, newFloatingNumber]);

        const particleCount = Math.min(10, Math.floor(effectiveMiningPower / 2) + 1);
        const newParticles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            const newParticle = {
                id: Date.now() + i,
                x: `${50 + (Math.random() - 0.5) * 30}%`,
                y: `${50 + (Math.random() - 0.5) * 30}%`,
                rotation: Math.random() * 360,
                size: Math.random() * 8 + 5,
            };
            newParticles.push(newParticle);
            setTimeout(() => {
                setParticles(prev => prev.filter(p => p.id !== newParticle.id));
            }, 1000);
        }
        setParticles(prev => [...prev, ...newParticles]);

        setTimeout(() => {
            setIsMining(false);
        }, 300);

        setTimeout(() => {
            setFloatingNumbers(prev => prev.filter(f => f.id !== newFloatingNumber.id));
        }, 1500);
    };
    
    const pickaxeDetails = getPickaxeDetails();

    return (
        <div className="relative flex flex-col items-center justify-center my-4">
             {floatingNumbers.map(f => (
                <span 
                    key={f.id} 
                    className="absolute text-yellow-300 font-bold text-2xl pointer-events-none animate-float-up"
                    style={{ left: `${f.x}%`, top: `${f.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                >
                    {f.value}
                </span>
            ))}
            <style jsx>{`
                @keyframes float-up {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-80px); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 1.5s ease-out forwards;
                }
                @keyframes particle-burst {
                    0% { transform: scale(0.5) translate(0, 0); opacity: 1; }
                    100% { transform: scale(1) translate(var(--tx, 0px), var(--ty, 0px)); opacity: 0; }
                }
                .animate-particle-burst {
                    animation: particle-burst 0.8s ease-out forwards;
                }
            `}</style>

            <div className="relative">
                 {particles.map(p => {
                    const angle = p.rotation * (Math.PI / 180);
                    const distance = 80;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;

                    return (
                        <div
                            key={p.id}
                            className="absolute bg-yellow-500 rounded-full pointer-events-none animate-particle-burst"
                            style={{
                                left: p.x,
                                top: p.y,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                '--tx': `${tx}px`,
                                '--ty': `${ty}px`,
                            } as React.CSSProperties}
                        />
                    );
                })}
                <button onClick={handleMineClick} className="w-64 h-64 bg-gray-700 rounded-full border-8 border-yellow-600 flex items-center justify-center focus:outline-none transition-transform duration-100 active:scale-95">
                    <span 
                        className={`text-7xl transition-all duration-300 ${isMining ? 'transform -rotate-45' : ''}`}
                    >
                        {pickaxeDetails.emoji}
                    </span>
                </button>
            </div>
            <p className="mt-4 text-yellow-200 text-lg">Click to Mine!</p>
            <p className="mt-1 text-sm font-bold" style={{ color: pickaxeDetails.nameColor }}>{pickaxeDetails.name}</p>
        </div>
    );
};

export default Miner;
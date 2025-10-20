import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, PlayerData, FieldPlayer, Ball, Strategy } from '../../types';
import { PLAYERS, FORMATIONS } from '../../gameConfig';

interface FootballMatchProps {
    player: Player;
    opponentStrength: number;
    onMatchEnd: (result: { result: 'WIN' | 'DEFEAT' | 'DRAW', gpChange: number, divisionPointsChange: number, score: string }) => void;
}

const GP_PER_GOAL = 100;
const GP_WIN = 1000;
const GP_DRAW = 400;
const GP_LOSS = 200;
const DP_WIN = 3;
const DP_DRAW = 1;
const DP_LOSS = -2;

const FootballMatch: React.FC<FootballMatchProps> = ({ player, opponentStrength, onMatchEnd }) => {
    const [score, setScore] = useState({ player: 0, opponent: 0 });
    const [time, setTime] = useState(0);
    const [log, setLog] = useState<string[]>(["0' - Kick Off!"]);
    const [isMatchOver, setIsMatchOver] = useState(false);
    const [fieldPlayers, setFieldPlayers] = useState<FieldPlayer[]>([]);
    const [ball, setBall] = useState<Ball>({ x: 50, y: 50, carrierId: null, targetX: 50, targetY: 50 });
    const [strategy, setStrategy] = useState<Strategy>('BALANCED');
    
    const playerTeamStrength = player.squad.reduce((acc, playerId) => acc + (PLAYERS[playerId]?.overall || 75), 0) / 11;
    const opponentTeamStrength = (opponentStrength / 10) + 70;

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const initializeMatch = useCallback(() => {
        const formation = FORMATIONS[player.activeFormationId] || FORMATIONS['4-3-3'];
        const newFieldPlayers: FieldPlayer[] = [];

        // Initialize player's team
        player.squad.forEach((playerId, index) => {
            const playerData = PLAYERS[playerId];
            const { x, y } = formation.coordinates[index];
            newFieldPlayers.push({ id: playerId, team: 'player', x, y, initialX: x, initialY: y, hasBall: false, data: playerData });
        });

        // Initialize opponent's team
        const opponentSquad = Object.values(PLAYERS).filter(p => p.rarity === 'Standard').sort(() => 0.5 - Math.random()).slice(0, 11);
        opponentSquad.forEach((playerData, index) => {
            const { x, y } = formation.coordinates[index];
            // Mirror opponent positions
            const opponentX = 100 - x;
            const opponentY = 100 - y;
            newFieldPlayers.push({ id: `opp-${playerData.id}`, team: 'opponent', x: opponentX, y: opponentY, initialX: opponentX, initialY: opponentY, hasBall: false, data: playerData });
        });
        
        setFieldPlayers(newFieldPlayers);

        // Kick off
        const startingTeam = Math.random() > 0.5 ? 'player' : 'opponent';
        const cf = newFieldPlayers.find(p => p.team === startingTeam && p.data.position === 'CF');
        if(cf) {
            setBall({ x: cf.x, y: cf.y, carrierId: cf.id, targetX: cf.x, targetY: cf.y });
        }

    }, [player.squad, player.activeFormationId, opponentStrength]);
    
    useEffect(() => {
        initializeMatch();
    }, [initializeMatch]);

    const getDistance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    const gameTick = useCallback(() => {
        if (time >= 90) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsMatchOver(true);
            setLog(prev => [`90' - Full Time!`, ...prev].slice(0, 5));
            // Finalize result after a delay
            setTimeout(() => {
                const { player: pScore, opponent: oScore } = score;
                let result: 'WIN' | 'DEFEAT' | 'DRAW';
                let gpChange = 0;
                let divisionPointsChange = 0;

                if (pScore > oScore) {
                    result = 'WIN';
                    gpChange = GP_WIN + (pScore * GP_PER_GOAL);
                    divisionPointsChange = DP_WIN;
                } else if (pScore < oScore) {
                    result = 'DEFEAT';
                    gpChange = GP_LOSS + (pScore * GP_PER_GOAL);
                    divisionPointsChange = DP_LOSS;
                } else {
                    result = 'DRAW';
                    gpChange = GP_DRAW + (pScore * GP_PER_GOAL);
                    divisionPointsChange = DP_DRAW;
                }
                onMatchEnd({ result, gpChange, divisionPointsChange, score: `${pScore} - ${oScore}` });
            }, 2000);
            return;
        }

        setTime(t => t + 1);

        let carrier: FieldPlayer | undefined;
        let newBall = { ...ball };
        const updatedPlayers = fieldPlayers.map(p => {
             if (p.id === ball.carrierId) carrier = p;
             return { ...p, hasBall: p.id === ball.carrierId };
        });

        // --- AI LOGIC ---
        if (carrier) {
             // Ball carrier action
            const carrierTeam = carrier.team;
            const opponentTeam = carrierTeam === 'player' ? 'opponent' : 'player';
            const goalY = carrierTeam === 'player' ? 100 : 0;

            // Decision: Pass, Dribble, or Shoot
            const shotChance = (getDistance(carrier.x, carrier.y, 50, goalY) < 40) ? (carrier.data.overall / 200) : 0;
            const passChance = 0.1;

            const defenders = updatedPlayers.filter(p => p.team === opponentTeam && getDistance(p.x, p.y, carrier!.x, carrier!.y) < 10);
            const tackleChance = defenders.reduce((acc, d) => acc + (d.data.overall / 2500), 0);

            if (Math.random() < tackleChance && defenders.length > 0) {
                // TACKLE
                const tackler = defenders[Math.floor(Math.random() * defenders.length)];
                newBall.carrierId = tackler.id;
                setLog(prev => [`${time}' - ${tackler.data.name} makes a great tackle!`, ...prev].slice(0, 5));
            }
            else if (Math.random() < shotChance) {
                // SHOT
                const keeper = updatedPlayers.find(p => p.team === opponentTeam && p.data.position === 'GK')!;
                const didScore = Math.random() < (carrier.data.overall / (carrier.data.overall + keeper.data.overall));
                if (didScore) {
                    setScore(s => carrierTeam === 'player' ? { ...s, player: s.player + 1 } : { ...s, opponent: s.opponent + 1 });
                    setLog(prev => [`${time}' - GOAL! What a shot from ${carrier.data.name}!`, ...prev].slice(0, 5));
                    // Reset positions after goal
                    initializeMatch();
                    return;
                } else {
                    setLog(prev => [`${time}' - ${carrier.data.name} shoots... Saved by the keeper!`, ...prev].slice(0, 5));
                    newBall.carrierId = keeper.id;
                }
            } else if (Math.random() < passChance) {
                // PASS
                const teammates = updatedPlayers.filter(p => p.team === carrierTeam && p.id !== carrier!.id);
                const target = teammates[Math.floor(Math.random() * teammates.length)];
                if (target) {
                    newBall.carrierId = target.id;
                    setLog(prev => [`${time}' - ${carrier!.data.name} passes to ${target.data.name}.`, ...prev].slice(0, 5));
                }
            } else {
                // DRIBBLE
                const moveY = carrierTeam === 'player' ? 5 : -5;
                carrier.y += moveY;
                carrier.x += (Math.random() - 0.5) * 4;
            }
        }
        
        // --- MOVEMENT LOGIC ---
        const strategyOffsetY = strategy === 'ATTACKING' ? 15 : strategy === 'DEFENSIVE' ? -15 : 0;

        setFieldPlayers(updatedPlayers.map(p => {
            let targetX = p.initialX;
            let targetY = p.initialY;
            const isPlayerTeam = p.team === 'player';
            
            // Apply strategy
            if (p.data.position !== 'GK' && isPlayerTeam) {
                targetY += strategyOffsetY;
            }
            
            // Follow ball
            targetX += (ball.x - p.x) * 0.1;
            targetY += (ball.y - p.y) * 0.2;

            // Move towards target
            const speed = 2;
            p.x += Math.max(-speed, Math.min(speed, targetX - p.x));
            p.y += Math.max(-speed, Math.min(speed, targetY - p.y));

            // Clamp positions
            p.x = Math.max(2, Math.min(98, p.x));
            p.y = Math.max(2, Math.min(98, p.y));

            if(p.id === newBall.carrierId) {
                newBall.x = p.x;
                newBall.y = p.y;
            }
            return p;
        }));

        setBall(newBall);

    }, [time, score, fieldPlayers, ball, strategy, initializeMatch, onMatchEnd]);

    useEffect(() => {
        intervalRef.current = setInterval(gameTick, 200);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gameTick]);

    const StrategyButton: React.FC<{ type: Strategy, label: string }> = ({ type, label }) => (
        <button onClick={() => setStrategy(type)} className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${strategy === type ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-white'}`}>
            {label}
        </button>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-80 p-2 rounded-xl border-2 border-cyan-700 animate-fade-in">
            {/* Scoreboard */}
            <div className="w-full flex justify-between items-center text-white text-center p-2 bg-gray-900/50 rounded-lg">
                 <div className="w-1/3">
                    <p className="text-lg font-bold truncate">{player.username}</p>
                 </div>
                 <div className="text-xl font-bold w-1/3">
                    <p className="text-4xl">{score.player} - {score.opponent}</p>
                    <p className="text-xl mt-1">{time}'</p>
                 </div>
                 <div className="w-1/3">
                    <p className="text-lg font-bold">Opponent</p>
                 </div>
            </div>

            {/* Pitch */}
            <div className="relative w-full aspect-video bg-green-700 border-2 border-gray-400 my-2 rounded-md bg-cover" style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/gen-z-airdrop.appspot.com/o/backgrounds%2Fpitch.svg?alt=media&token=c27e0a29-b68a-4467-8e10-c0813f381273')`}}>
                {fieldPlayers.map(p => (
                    <div key={p.id} style={{ left: `${p.x}%`, top: `${p.y}%`, transition: 'all 0.2s linear' }} className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center">
                       <div className={`w-full h-full rounded-full ${p.team === 'player' ? 'bg-blue-500' : 'bg-red-500'} border-2 ${p.id === ball.carrierId ? 'border-yellow-300 animate-pulse' : 'border-black'}`}></div>
                    </div>
                ))}
                 <div style={{ left: `${ball.x}%`, top: `${ball.y}%`, transition: 'all 0.2s linear' }} className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-black"></div>
            </div>

            {/* Controls & Log */}
            <div className="w-full flex gap-2">
                <div className="w-1/3 bg-gray-900/50 rounded p-2 flex flex-col justify-center items-center space-y-1">
                    <StrategyButton type="ATTACKING" label="Attacking" />
                    <StrategyButton type="BALANCED" label="Balanced" />
                    <StrategyButton type="DEFENSIVE" label="Defensive" />
                </div>
                <div className="w-2/3 h-24 bg-black/30 rounded p-2 text-xs text-gray-300 text-center flex flex-col-reverse overflow-hidden">
                    {log.map((l, i) => <p key={i} className={`truncate ${i === 0 ? 'text-white animate-fade-in' : 'opacity-60'}`}>{l}</p>)}
                </div>
            </div>
        </div>
    );
};

export default FootballMatch;

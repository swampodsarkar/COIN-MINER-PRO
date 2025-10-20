import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Player, Weapon, Armor, Helmet } from '../../types';
import { WEAPONS, ARMOR, HELMETS, MAP_LOCATIONS, CHARACTERS } from '../../gameConfig';
import { ProgressBar } from '../ui/ProgressBar';

interface ChallengeMatchProps {
    player: Player;
    onMatchEnd: (result: 'VICTORY' | 'DEFEAT', goldChange: number, rankPointsChange: number, playerCharacterId: string, placement: number, kills: number) => void;
}

const GOLD_PER_KILL = 20;
const GOLD_PER_PLACEMENT = (place: number) => Math.max(0, 100 - (place * 2));
const RP_CHANGE = (place: number, rank: Player['rank']) => {
    // Less RP loss for higher ranks
    const baseGain = 25;
    const lossMultiplier = rank === 'Bronze' || rank === 'Silver' ? 0.5 : 0.75;
    return Math.floor(baseGain - (place * lossMultiplier));
};

// --- Helper Functions ---
const getRandomItem = <T,>(obj: Record<string, T>): T => {
    const items = Object.values(obj);
    return items[Math.floor(Math.random() * items.length)];
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const getLoot = (currentTier: number, isLucky: boolean): { type: 'weapon' | 'armor' | 'helmet' | 'medkit', item: Weapon | Armor | Helmet | null } | null => {
    const lootChance = Math.random();
    if (lootChance < 0.6) { // 60% chance to find something
        const typeOfLoot = Math.random();
        if (typeOfLoot < 0.3) { // Find medkit
            return { type: 'medkit', item: null };
        } else if (typeOfLoot < 0.55) { // Find weapon
            const newItem = getRandomItem(WEAPONS);
            if (newItem.tier > currentTier || isLucky) return { type: 'weapon', item: newItem };
        } else if (typeOfLoot < 0.8) { // Find armor
            const newItem = getRandomItem(ARMOR);
            if (newItem.tier > currentTier || isLucky) return { type: 'armor', item: newItem };
        } else { // Find helmet
            const newItem = getRandomItem(HELMETS);
            if (newItem.tier > currentTier || isLucky) return { type: 'helmet', item: newItem };
        }
    }
    return null;
};

// --- Component ---
const ChallengeMatch: React.FC<ChallengeMatchProps> = ({ player, onMatchEnd }) => {
    const [gameState, setGameState] = useState<'parachuting' | 'playing' | 'finished'>('parachuting');
    const [hp, setHp] = useState(player.equippedPet === 'ottero' ? 120 : 100);
    const [maxHp, setMaxHp] = useState(player.equippedPet === 'ottero' ? 120 : 100);
    const [kills, setKills] = useState(0);
    const [playersLeft, setPlayersLeft] = useState(50);
    const [log, setLog] = useState<string[]>([]);
    const [inventory, setInventory] = useState<{ weapon: Weapon, armor: Armor, helmet: Helmet, medkits: number }>({
        weapon: WEAPONS.pistol,
        armor: ARMOR.vest1,
        helmet: HELMETS.helmet1,
        medkits: 1
    });
    const [location, setLocation] = useState<string>('');
    const [safeZone, setSafeZone] = useState<{ current: number, nextLocation: string, timer: number }>({ current: 1, nextLocation: '', timer: 45 });
    const [matchResult, setMatchResult] = useState<{ placement: number, isVictory: boolean } | null>(null);
    const [isActionInProgress, setIsActionInProgress] = useState(false);
    
    // Visual effect states
    const [isTakingDamage, setIsTakingDamage] = useState(false);
    const [isShooting, setIsShooting] = useState(false);
    const [isHealing, setIsHealing] = useState(false);

    const playerCharacter = CHARACTERS[player.ownedCharacters[0] || 'alok'];
    const landingOptions = useMemo(() => shuffleArray(MAP_LOCATIONS).slice(0, 3), []);

    const addToLog = useCallback((message: string) => {
        setLog(prev => [message, ...prev].slice(0, 5));
    }, []);

    // Game Over Logic
    useEffect(() => {
        if (hp <= 0 && gameState === 'playing') {
            addToLog('You have been eliminated!');
            setMatchResult({ placement: playersLeft, isVictory: false });
            setGameState('finished');
        }
        if (playersLeft <= 1 && gameState === 'playing') {
            addToLog('BOOYAH! You are the last one standing!');
            setMatchResult({ placement: 1, isVictory: true });
            setGameState('finished');
        }
    }, [hp, playersLeft, gameState, addToLog]);
    
    // Call onMatchEnd when finished
    useEffect(() => {
        if (gameState === 'finished' && matchResult) {
            const result = matchResult.isVictory ? 'VICTORY' : 'DEFEAT';
            const bonusGoldPerKill = player.equippedPet === 'panda' ? 10 : 0;
            const goldChange = (kills * (GOLD_PER_KILL + bonusGoldPerKill)) + GOLD_PER_PLACEMENT(matchResult.placement);
            const rankPointsChange = RP_CHANGE(matchResult.placement, player.rank);
            onMatchEnd(result, Math.round(goldChange), rankPointsChange, playerCharacter.id, matchResult.placement, kills);
        }
    }, [gameState, matchResult, onMatchEnd, playerCharacter.id, kills, player.equippedPet, player.rank]);
    
    // Safe Zone Timer
    useEffect(() => {
        if (gameState !== 'playing') return;
        
        const interval = setInterval(() => {
            setSafeZone(prev => {
                if (prev.timer <= 1) {
                    const newPlayersLeft = Math.max(playersLeft - Math.floor(Math.random() * 5 + 5), 2);
                    setPlayersLeft(newPlayersLeft);
                    
                    const newLocation = MAP_LOCATIONS.filter(l => l !== location)[Math.floor(Math.random() * (MAP_LOCATIONS.length - 1))];
                    addToLog(`The Safe Zone is shrinking! Next zone: ${newLocation}`);
                    
                    if(location !== prev.nextLocation) {
                        addToLog('You are outside the zone and taking damage!');
                        setHp(h => h - 15);
                        setIsTakingDamage(true);
                        setTimeout(() => setIsTakingDamage(false), 300);
                    }

                    return { current: prev.current + 1, nextLocation: newLocation, timer: 45 };
                }
                return { ...prev, timer: prev.timer - 1 };
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [gameState, playersLeft, location, addToLog]);

    const handleAction = (action: 'move' | 'scavenge' | 'heal') => {
        if (isActionInProgress) return;
        setIsActionInProgress(true);

        switch (action) {
            case 'scavenge':
                addToLog('You are scavenging for loot...');
                setTimeout(() => {
                    const foundLoot = getLoot(inventory.weapon.tier, false);
                    if (foundLoot) {
                         if (foundLoot.type === 'medkit') {
                            setInventory(i => ({...i, medkits: i.medkits + 1}));
                            addToLog(`Found a Medkit!`);
                        } else {
                            const item = foundLoot.item as Weapon | Armor | Helmet;
                            setInventory(i => ({...i, [foundLoot.type]: item}));
                            addToLog(`Found a better item: ${item.name}!`);
                        }
                    } else {
                        addToLog('Found nothing of value.');
                    }
                    if (Math.random() < 0.3) runEnemyEncounter();
                    setIsActionInProgress(false);
                }, 2000);
                break;
            
            case 'move':
                addToLog(`Moving towards ${safeZone.nextLocation}...`);
                setTimeout(() => {
                    setLocation(safeZone.nextLocation);
                    addToLog(`You arrived at ${safeZone.nextLocation}.`);
                    if (Math.random() < 0.5) runEnemyEncounter();
                    setIsActionInProgress(false);
                }, 3000);
                break;

            case 'heal':
                if(inventory.medkits > 0 && hp < maxHp) {
                    addToLog('Using a Medkit...');
                    setIsHealing(true);
                    setTimeout(() => {
                        setHp(h => Math.min(maxHp, h + 50));
                        setInventory(i => ({ ...i, medkits: i.medkits - 1 }));
                        addToLog('You feel much better.');
                        setIsActionInProgress(false);
                        setIsHealing(false);
                    }, 1500);
                } else {
                    setIsActionInProgress(false);
                }
                break;
        }
    };
    
    const runEnemyEncounter = () => {
        addToLog('Enemy spotted!');
        setIsShooting(true);
        setTimeout(() => setIsShooting(false), 100);

        const playerPower = inventory.weapon.tier + inventory.armor.tier + inventory.helmet.tier;
        const enemyPower = (Math.floor(Math.random() * 3) + 1) * 3; // Random enemy gear
        
        setTimeout(() => {
            if (playerPower > enemyPower || Math.random() > 0.4) {
                addToLog('You won the firefight! Enemy eliminated!');
                setKills(k => k + 1);
                setPlayersLeft(p => p - 1);
            } else {
                const damage = Math.floor(Math.random() * 20 + 20);
                addToLog(`You lost the firefight and took ${damage} damage!`);
                setHp(h => h - damage);
                setIsTakingDamage(true);
                setTimeout(() => setIsTakingDamage(false), 300);
            }
        }, 1500);
    };

    const handleLand = (landingLocation: string) => {
        setLocation(landingLocation);
        const nextZone = MAP_LOCATIONS.filter(l => l !== landingLocation)[Math.floor(Math.random() * (MAP_LOCATIONS.length - 1))];
        setSafeZone(prev => ({ ...prev, nextLocation: nextZone }));
        
        // Falco pet bonus
        const hasFalco = player.equippedPet === 'falco';
        const initialLoot = getLoot(0, hasFalco);
        if (initialLoot && initialLoot.type !== 'medkit' && initialLoot.item) {
             const item = initialLoot.item as Weapon | Armor | Helmet;
             setInventory(i => ({...i, [initialLoot.type]: item}));
             addToLog(`Landed at ${landingLocation}. ${hasFalco ? 'Falco helps you spot' : 'You found'} a ${item.name}!`);
        } else {
            addToLog(`Landed at ${landingLocation}. Found a Pistol.`);
        }
        
        setGameState('playing');
    };

    // --- RENDER LOGIC ---

    if (gameState === 'parachuting') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 p-4 animate-fade-in">
                <h2 className="text-4xl text-orange-400 font-bold mb-2">CHOOSE YOUR LANDING SPOT</h2>
                <p className="text-gray-300 mb-8">Where will you drop?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                    {landingOptions.map(loc => (
                        <button key={loc} onClick={() => handleLand(loc)} className="bg-gray-800 hover:bg-orange-600 border-2 border-gray-700 hover:border-orange-500 text-white font-bold py-8 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                            {loc}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    if (gameState === 'finished') {
        const isWin = matchResult?.isVictory ?? false;
        return (
             <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                <h1 className={`text-6xl sm:text-8xl font-bold tracking-widest animate-victory ${isWin ? 'text-orange-400' : 'text-gray-400'}`}>
                    {isWin ? 'BOOYAH!' : 'DEFEAT'}
                </h1>
                <p className="mt-4 text-xl text-white">
                    You finished #{matchResult?.placement} with {kills} kills.
                </p>
            </div>
        );
    }

    const containerClasses = [
        "w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-80 p-2 sm:p-4 rounded-xl border-2 border-red-800 text-white transition-all duration-100",
        isTakingDamage ? 'animate-screen-shake' : '',
        isShooting ? 'animate-muzzle-flash' : '',
        isHealing ? 'animate-healing-pulse' : '',
    ].join(' ');

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className="w-full flex justify-between items-center bg-black/30 p-2 rounded-lg">
                 <div className="text-center">
                    <p className="text-sm">ALIVE</p>
                    <p className="text-2xl font-bold text-green-400">{playersLeft}</p>
                </div>
                 <div className="text-center">
                     <p className="text-sm">LOCATION</p>
                     <p className="text-xl font-bold text-white">{location}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-sm">KILLS</p>
                    <p className="text-2xl font-bold text-red-400">{kills}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full my-4 flex-grow flex flex-col justify-around">
                <div className="w-full max-w-sm mx-auto space-y-3">
                     <ProgressBar value={hp} max={maxHp} color="#ef4444" label="HEALTH"/>
                     <div className="flex justify-around bg-gray-900/50 p-2 rounded-lg">
                        <div className="text-center" title={inventory.weapon.name}><span className="text-3xl">{inventory.weapon.emoji}</span> <span className="text-xs">T{inventory.weapon.tier}</span></div>
                        <div className="text-center" title={inventory.armor.name}><span className="text-3xl">{inventory.armor.emoji}</span> <span className="text-xs">T{inventory.armor.tier}</span></div>
                        <div className="text-center" title={inventory.helmet.name}><span className="text-3xl">{inventory.helmet.emoji}</span> <span className="text-xs">T{inventory.helmet.tier}</span></div>
                        <div className="text-center" title="Medkits"><span className="text-3xl">🩹</span> <span className="text-xs">x{inventory.medkits}</span></div>
                     </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 w-full max-w-sm mx-auto">
                    <button onClick={() => handleAction('move')} disabled={isActionInProgress} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 font-bold p-3 rounded-lg border-b-4 border-blue-800 disabled:border-gray-700 transition-all">
                        Move to Safe Zone ({safeZone.nextLocation})
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleAction('scavenge')} disabled={isActionInProgress} className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 font-bold p-3 rounded-lg border-b-4 border-yellow-700 disabled:border-gray-700 transition-all">
                            Scavenge
                        </button>
                         <button onClick={() => handleAction('heal')} disabled={isActionInProgress || inventory.medkits <= 0 || hp === maxHp} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 font-bold p-3 rounded-lg border-b-4 border-green-800 disabled:border-gray-700 transition-all">
                            Use Medkit ({inventory.medkits})
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Log */}
            <div className="w-full h-28 bg-black/40 rounded-lg p-2 text-sm text-gray-300 flex flex-col-reverse overflow-y-auto">
                {log.map((l, i) => <p key={i} className={`animate-fade-in ${i === 0 ? 'text-white' : 'opacity-60'}`}>{l}</p>)}
                <div className="text-center text-orange-400 font-bold">Zone shrinks in: {safeZone.timer}s</div>
            </div>
        </div>
    );
};

export default ChallengeMatch;
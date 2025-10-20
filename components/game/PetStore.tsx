import React, { useState } from 'react';
import { Player } from '../../types';
import { PLAYERS, FORMATIONS } from '../../gameConfig';

interface GamePlanScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const PlayerCard: React.FC<{ playerId: string, isSelected: boolean, onClick: () => void }> = ({ playerId, isSelected, onClick }) => {
    const p = PLAYERS[playerId];
    if (!p) return null;

    const rarityColor = {
        Standard: 'border-gray-500',
        Featured: 'border-purple-400',
        Legendary: 'border-yellow-300',
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-gray-800 text-white rounded p-2 flex items-center justify-between border-2 ${rarityColor[p.rarity]} ${isSelected ? 'ring-2 ring-cyan-400' : ''} cursor-pointer`}>
            <div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-xs text-gray-400">{p.position}</p>
            </div>
            <p className="text-lg font-black">{p.overall}</p>
        </div>
    );
};


const GamePlanScreen: React.FC<GamePlanScreenProps> = ({ player, setPlayer }) => {
    const [selectedSquadIndex, setSelectedSquadIndex] = useState<number | null>(null);

    const handlePlayerSelect = (playerId: string) => {
        if (selectedSquadIndex === null) return;
        
        // Cannot select a player who is already in the squad or subs
        if (player.squad.includes(playerId) || player.substitutes.includes(playerId)) {
            // Logic for swapping
            const targetList = player.squad.includes(playerId) ? 'squad' : 'substitutes';
            const targetIndex = player[targetList].indexOf(playerId);

            const playerToSwapOut = player.squad[selectedSquadIndex];

            const newSquad = [...player.squad];
            const newSubs = [...player.substitutes];

            if (targetList === 'squad') {
                newSquad[selectedSquadIndex] = playerId;
                newSquad[targetIndex] = playerToSwapOut;
            } else { // target is substitutes
                newSquad[selectedSquadIndex] = playerId;
                newSubs[targetIndex] = playerToSwapOut;
            }
            
            setPlayer(p => p ? {...p, squad: newSquad, substitutes: newSubs } : null);

        } else {
            // Add player to squad
            const newSquad = [...player.squad];
            const playerToBench = newSquad[selectedSquadIndex];
            newSquad[selectedSquadIndex] = playerId;
            
            const newSubstitutes = [...player.substitutes, playerToBench].filter(id => !newSquad.includes(id));

            setPlayer(p => p ? { ...p, squad: newSquad, substitutes: newSubstitutes.slice(0, 7) } : null);
        }
        setSelectedSquadIndex(null);
    };

    const formation = FORMATIONS[player.activeFormationId] || FORMATIONS['4-3-3'];
    const ownedPlayersNotInLineup = player.ownedPlayerIds
        .filter(id => !player.squad.includes(id) && !player.substitutes.includes(id))
        .map(id => PLAYERS[id])
        .sort((a,b) => b.overall - a.overall);


    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 bg-black bg-opacity-70 p-4 rounded-xl border-2 border-green-500">
            {/* Left side: Squad and Subs */}
            <div className="w-full md:w-1/2 flex flex-col">
                <h3 className="text-center text-xl font-bold text-green-300 mb-2">SQUAD ({player.activeFormationId})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-grow">
                    {player.squad.map((playerId, index) => (
                        <div key={`${playerId}-${index}`} onClick={() => setSelectedSquadIndex(index)} className="relative">
                            <PlayerCard playerId={playerId} isSelected={selectedSquadIndex === index} onClick={() => setSelectedSquadIndex(index)} />
                             <span className="absolute top-0 left-0 bg-black/50 text-white text-xs font-bold px-1 rounded-br-md">{formation.positions[index]}</span>
                        </div>
                    ))}
                </div>
                 <h3 className="text-center text-xl font-bold text-green-300 my-2">SUBSTITUTES</h3>
                <div className="grid grid-cols-4 gap-2">
                     {player.substitutes.map((playerId, index) => (
                        <div key={`${playerId}-${index}`} className="relative">
                           <PlayerCard playerId={playerId} isSelected={false} onClick={() => {}} />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Right side: Owned Players */}
            <div className="w-full md:w-1/2 flex flex-col">
                <h3 className="text-center text-xl font-bold text-green-300 mb-2">RESERVES</h3>
                 <div className="flex-grow overflow-y-auto pr-1 bg-gray-900/50 p-2 rounded-lg">
                    {selectedSquadIndex !== null ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ownedPlayersNotInLineup.map(p => (
                                <PlayerCard key={p.id} playerId={p.id} isSelected={false} onClick={() => handlePlayerSelect(p.id)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 p-8">Select a player from your squad to replace.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GamePlanScreen;

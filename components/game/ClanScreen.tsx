import React, { useState, useEffect } from 'react';
import { Player, Clan, ClanMember } from '../../types';
import { database } from '../../services/firebase';
import { Spinner } from '../ui/Spinner';
import Modal from '../ui/Modal';

interface ClanScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const CLAN_CREATE_COST = 5000;
const MAX_CLAN_MEMBERS = 20;

const ClanScreen: React.FC<ClanScreenProps> = ({ player, setPlayer }) => {
    const [clans, setClans] = useState<Clan[]>([]);
    const [playerClan, setPlayerClan] = useState<Clan | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const clansRef = database.ref('clans');
        clansRef.on('value', snapshot => {
            const data = snapshot.val();
            const clanList: Clan[] = data ? Object.keys(data).map(key => ({ id: key, members: {}, ...data[key] })) : [];
            setClans(clanList);

            if (player.clanId) {
                setPlayerClan(clanList.find(c => c.id === player.clanId) || null);
            } else {
                setPlayerClan(null);
            }
            setLoading(false);
        });

        return () => clansRef.off();
    }, [player.clanId]);

    const handleCreateClan = async (name: string, tag: string) => {
        if (player.gold < CLAN_CREATE_COST) {
            alert("Not enough gold!");
            return;
        }

        const newClanRef = database.ref('clans').push();
        const newClan: Omit<Clan, 'id'> = {
            name,
            tag,
            leaderUid: player.uid,
            members: {
                [player.uid]: {
                    uid: player.uid,
                    username: player.username,
                    rank: player.rank
                }
            }
        };

        await newClanRef.set(newClan);
        await database.ref(`users/${player.uid}`).update({ 
            clanId: newClanRef.key,
            gold: player.gold - CLAN_CREATE_COST
        });

        setPlayer(p => p ? { ...p, gold: p.gold - CLAN_CREATE_COST, clanId: newClanRef.key! } : null);
        setShowCreateModal(false);
    };

    const handleJoinClan = async (clanId: string) => {
        const clanToJoin = clans.find(c => c.id === clanId);
        if (!clanToJoin || (clanToJoin.members && Object.keys(clanToJoin.members).length >= MAX_CLAN_MEMBERS)) {
            alert("Clan is full or does not exist.");
            return;
        }

        const newMember: ClanMember = {
            uid: player.uid,
            username: player.username,
            rank: player.rank
        };

        await database.ref(`clans/${clanId}/members/${player.uid}`).set(newMember);
        await database.ref(`users/${player.uid}`).update({ clanId: clanId });
        setPlayer(p => p ? { ...p, clanId } : null);
    };

    const handleLeaveClan = async () => {
        if (!playerClan) return;

        const updates: { [key: string]: any } = {};
        updates[`users/${player.uid}/clanId`] = null;
        
        const isLeader = player.uid === playerClan.leaderUid;
        const remainingMembers = (playerClan.members ? (Object.values(playerClan.members) as ClanMember[]).filter(m => m.uid !== player.uid) : []);

        if(isLeader && remainingMembers.length > 0) {
             updates[`clans/${playerClan.id}/leaderUid`] = remainingMembers[0].uid;
             updates[`clans/${playerClan.id}/members/${player.uid}`] = null;
        } else if (isLeader && remainingMembers.length === 0) {
            // Last member is the leader, disband clan
            updates[`clans/${playerClan.id}`] = null;
        } else {
            // Member is not leader
            updates[`clans/${playerClan.id}/members/${player.uid}`] = null;
        }
        
        await database.ref().update(updates);

        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = { ...p };
            delete updatedPlayer.clanId;
            return updatedPlayer;
        });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Spinner /></div>;
    }
    
    if (playerClan) {
        const members = Object.values(playerClan.members || {}) as ClanMember[];
        return (
            <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-green-500">
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-orange-300">{playerClan.name}</h2>
                    <p className="text-xl text-gray-400">[{playerClan.tag}]</p>
                    <p className="text-sm text-gray-400">Members: {members.length} / {MAX_CLAN_MEMBERS}</p>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 mb-4">
                    <ul className="space-y-2">
                        {members.map(member => (
                            <li key={member.uid} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
                                <span>{member.uid === playerClan.leaderUid ? '👑' : ''} {member.username}</span>
                                <span className="text-sm text-orange-300">{member.rank}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleLeaveClan} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Leave Clan
                </button>
            </div>
        );
    }
    
    return (
         <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-gray-600">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-orange-300">Join a Clan</h2>
                <p className="text-gray-400 mb-4">Team up with other players!</p>
                <button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
                    Create Clan (💰{CLAN_CREATE_COST.toLocaleString()})
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                <ul className="space-y-2">
                    {clans.map(clan => (
                        <li key={clan.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                            <div>
                                <p className="font-bold">{clan.name} [{clan.tag}]</p>
                                <p className="text-sm text-gray-400">Members: {Object.keys(clan.members || {}).length}/{MAX_CLAN_MEMBERS}</p>
                            </div>
                            <button onClick={() => handleJoinClan(clan.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md">
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {showCreateModal && <CreateClanModal onCreate={handleCreateClan} onClose={() => setShowCreateModal(false)} />}
        </div>
    );
};

const CreateClanModal: React.FC<{onClose: () => void, onCreate: (name: string, tag: string) => void}> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3 || tag.trim().length < 2 || tag.trim().length > 4) {
            alert("Invalid name or tag. Name must be 3+ chars, Tag must be 2-4 chars.");
            return;
        }
        onCreate(name, tag.toUpperCase());
    }

    return (
        <Modal title="Create Your Clan" onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                 <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Clan Name (e.g. Elite Squad)" className="w-full bg-gray-700 p-2 rounded text-white" required minLength={3} />
                 <input type="text" value={tag} onChange={e => setTag(e.target.value)} placeholder="Clan Tag (2-4 chars)" className="w-full bg-gray-700 p-2 rounded text-white" required minLength={2} maxLength={4} />
                 <p className="text-xs text-gray-400 text-center">Cost: 💰{CLAN_CREATE_COST.toLocaleString()} Gold</p>
                 <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 rounded">Create</button>
            </form>
        </Modal>
    );
}

export default ClanScreen;
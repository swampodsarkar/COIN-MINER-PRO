import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { Player } from '../../types';
import { Spinner } from '../ui/Spinner';
import Modal from '../ui/Modal';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<Player[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<Player | null>(null);
    const [editGold, setEditGold] = useState(0);
    const [editDiamonds, setEditDiamonds] = useState(0);

    useEffect(() => {
        const usersRef = database.ref('users');
        usersRef.on('value', snapshot => {
            const usersData = snapshot.val();
            const usersList = usersData ? Object.values(usersData) as Player[] : [];
            setUsers(usersList);
            setFilteredUsers(usersList);
            setLoading(false);
        });
        return () => usersRef.off();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleBanToggle = (user: Player) => {
        database.ref(`users/${user.uid}/banned`).set(!user.banned);
    };

    const openEditModal = (user: Player) => {
        setEditingUser(user);
        setEditGold(user.gold ?? 0);
        setEditDiamonds(user.diamonds ?? 0);
    };
    
    const handleSaveChanges = () => {
        if (!editingUser) return;
        database.ref(`users/${editingUser.uid}`).update({
            gold: Number(editGold),
            diamonds: Number(editDiamonds),
        });
        setEditingUser(null);
    };

    if (loading) return <div className="flex justify-center"><Spinner /></div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
             <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Gold</th>
                            <th className="p-2">Diamonds</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.uid} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="p-2">{user.username}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{Math.floor(user.gold ?? 0).toLocaleString()}</td>
                                <td className="p-2">{(user.diamonds ?? 0).toLocaleString()}</td>
                                <td className="p-2">{user.banned ? <span className="text-red-500">Banned</span> : <span className="text-green-500">Active</span>}</td>
                                <td className="p-2 space-x-2">
                                    <button onClick={() => openEditModal(user)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                    <button onClick={() => handleBanToggle(user)} className={`text-sm ${user.banned ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}>
                                        {user.banned ? 'Unban' : 'Ban'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingUser && (
                <Modal title={`Edit ${editingUser.username}`} onClose={() => setEditingUser(null)}>
                    <div className="space-y-4 p-4">
                        <div>
                            <label className="block text-sm text-gray-400">Gold</label>
                            <input type="number" value={editGold} onChange={e => setEditGold(Number(e.target.value))} className="w-full bg-gray-700 p-2 rounded" />
                        </div>
                         <div>
                            <label className="block text-sm text-gray-400">Diamonds</label>
                            <input type="number" value={editDiamonds} onChange={e => setEditDiamonds(Number(e.target.value))} className="w-full bg-gray-700 p-2 rounded" />
                        </div>
                        <button onClick={handleSaveChanges} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded">Save Changes</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;
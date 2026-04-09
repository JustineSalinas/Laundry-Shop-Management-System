import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import StaffModal from '../components/StaffModal';

const StaffManagement = () => {
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const token = localStorage.getItem('token');
    
    // We fetch the JWT from localStorage and configure the authorization header headers for this protected route.
    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    const fetchStaff = async () => {
        try {
            setErrorMsg('');
            const res = await axios.get('https://dazzlingly-unemerged-sean.ngrok-free.dev/api/staff', getAuthHeaders());
            setStaffList(res.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setErrorMsg(error.response?.data?.message || 'Access Denied or Server Error');
        }
    };

    useEffect(() => {
        fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStaffSaved = () => {
        setIsModalOpen(false);
        setSelectedStaff(null);
        fetchStaff();
    };

    const confirmDelete = async (id, username) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${username}"?`)) return;
        try {
            await axios.delete(`https://dazzlingly-unemerged-sean.ngrok-free.dev/api/staff/${id}`, getAuthHeaders());
            fetchStaff();
        } catch (error) {
            alert('Failed to delete staff member: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black mb-1">Staff Management</h2>
                        <p className="text-secondary text-sm font-medium">Administrator privileges: Manage cashiers and system users.</p>
                    </div>
                    <button 
                        onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }}
                        className="py-3 px-6 bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary font-bold rounded-xl shadow-lg shadow-tertiary/20 hover:shadow-tertiary/30 hover:brightness-110 transition-all flex items-center space-x-2 active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span>Add New Staff</span>
                    </button>
                </section>

                {errorMsg && (
                    <div className="bg-error-container text-error text-center font-bold p-4 rounded-xl shadow-sm border border-error/20">
                        <span className="material-symbols-outlined align-middle mr-2">lock</span>
                        {errorMsg}
                    </div>
                )}

                {/* Data Table */}
                <section className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_30px_rgba(0,73,122,0.08)] border border-white/50 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-high/50 text-xs uppercase tracking-wider text-secondary font-bold">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Date Added</th>
                                    <th className="p-4 text-right pr-6">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {staffList.length === 0 && !errorMsg ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-secondary font-medium">
                                            Loading staff data...
                                        </td>
                                    </tr>
                                ) : (
                                    staffList.map(user => (
                                        <tr key={user.id} className="hover:bg-surface-container-lowest/80 transition-colors group">
                                            <td className="p-4 pl-6 font-semibold text-primary">#{user.id}</td>
                                            <td className="p-4 font-bold text-on-surface">{user.username}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${user.role === 'admin' ? 'bg-primary-container text-primary' : 'bg-surface-container-high text-secondary'}`}>
                                                    <span className="material-symbols-outlined text-[14px] mr-1">
                                                        {user.role === 'admin' ? 'admin_panel_settings' : 'badge'}
                                                    </span>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-secondary font-medium">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right pr-6 space-x-2">
                                                <button 
                                                    onClick={() => { setSelectedStaff(user); setIsModalOpen(true); }}
                                                    className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-primary font-bold rounded-lg text-xs transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(user.id, user.username)}
                                                    className="px-3 py-1.5 bg-error-container/20 text-error hover:bg-error-container hover:text-error font-bold rounded-lg text-xs transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <StaffModal 
                    staff={selectedStaff} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleStaffSaved}
                    authHeaders={getAuthHeaders()} 
                />
            )}
        </Layout>
    );
};

export default StaffManagement;

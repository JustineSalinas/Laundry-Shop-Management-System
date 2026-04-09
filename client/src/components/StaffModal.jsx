import React, { useState } from 'react';
import axios from 'axios';

const StaffModal = ({ staff, onClose, onSuccess, authHeaders }) => {
    const [username, setUsername] = useState(staff?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState(staff?.role || 'staff');
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isEdit = !!staff;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Password Validation: 8-20 chars, no spaces/dashes, at least one letter and one number
        if (password) {
            const isValid = /^(?=.*[a-zA-Z])(?=.*\d)[^\s-]{8,20}$/.test(password);
            if (!isValid) {
                setErrorMsg('Password must be 8-20 characters, contain letters and numbers, and have no spaces or dashes.');
                return;
            }
        }

        setIsLoading(true);

        try {
            const payload = { username, role, password };

            if (isEdit) {
                // For edit, password is intentionally optional on the backend
                await axios.put(`${import.meta.env.VITE_API_URL}/api/staff/${staff.id}`, payload, authHeaders);
            } else {
                if (!password) throw new Error("Password is required for new users");
                await axios.post(`${import.meta.env.VITE_API_URL}/api/staff`, payload, authHeaders);
            }
            onSuccess();
        } catch (error) {
            setErrorMsg(error.message || error.response?.data?.message || 'Failed to save staff member');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
            <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm cursor-pointer" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl p-8 border border-white/50 modal-content">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-secondary hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                <h2 className="text-2xl font-black text-on-surface mb-2">
                    {isEdit ? 'Edit User' : 'New Staff'}
                </h2>
                <p className="text-sm text-secondary font-medium mb-6">
                    {isEdit ? 'Update credentials.' : 'Add a new member to the team.'}
                </p>

                {errorMsg && (
                    <div className="bg-error-container text-error text-[13px] p-3 rounded-lg text-center font-bold mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Username *</label>
                        <input 
                            type="text" required
                            value={username} onChange={e => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-bold text-on-surface"
                            placeholder="e.g. cashier1"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">
                            {isEdit ? 'New Password (Optional)' : 'Password *'}
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} required={!isEdit} maxLength={20}
                                value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 pr-10 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium text-on-surface"
                                placeholder="*************"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary px-1">Privilege Level</label>
                        <select 
                            value={role} onChange={e => setRole(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-bold text-on-surface"
                        >
                            <option value="staff">Staff / Cashier</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full py-4 mt-4 bg-tertiary text-on-tertiary font-bold rounded-xl shadow-lg shadow-tertiary/20 hover:shadow-tertiary/30 hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">{isLoading ? 'hourglass_empty' : 'save'}</span>
                        <span>{isLoading ? 'Saving...' : 'Save Credentials'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
